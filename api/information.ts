/**
 * Vercel Serverless Function — POST /api/information
 *
 * Entrada:  { "category": "sobrepeso" }   (apenas a categoria — nenhum dado pessoal)
 * Saída:    { category, mode, sources: InformationSource[] }
 *
 * Com INFORMATION_API_KEY (Brave Search API) configurada, pesquisa na web e mantém
 * apenas resultados de domínios confiáveis. Sem a chave, ou se a pesquisa falhar,
 * responde com a seleção curada de fontes oficiais.
 */
import {
  BLOCKED_TERMS,
  CURATED_SOURCES,
  SEARCH_QUERIES,
  TRUSTED_DOMAINS,
  isIMCCategory,
} from '../src/data/sources.js';
import type { IMCCategory, InformationResponse, InformationSource } from '../src/types/imc';

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

interface BraveResult {
  title?: string;
  url?: string;
  description?: string;
  page_age?: string;
  age?: string;
}

interface BraveResponse {
  web?: { results?: BraveResult[] };
}

const MAX_SOURCES = 6;
const SEARCH_TIMEOUT_MS = 6000;

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function trustedDomainFor(url: string): (typeof TRUSTED_DOMAINS)[number] | undefined {
  let host: string;
  let path: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return undefined;
    host = parsed.hostname.toLowerCase();
    path = parsed.pathname.toLowerCase();
  } catch {
    return undefined;
  }
  // www.gov.br/saude/... é o portal do Ministério da Saúde.
  const isGovPortal = host === 'www.gov.br' || host === 'gov.br';
  const lookup = isGovPortal && path.startsWith('/saude') ? 'saude.gov.br' : host;
  // O domínio mais específico vence (saude.gov.br antes de gov.br).
  return [...TRUSTED_DOMAINS]
    .sort((a, b) => b.domain.length - a.domain.length)
    .find(({ domain }) => lookup === domain || lookup.endsWith(`.${domain}`));
}

function isBlocked(result: BraveResult): boolean {
  const text = `${result.title ?? ''} ${result.description ?? ''} ${result.url ?? ''}`.toLowerCase();
  return BLOCKED_TERMS.some((term) => text.includes(term));
}

function formatAge(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
}

async function searchLive(category: IMCCategory, apiKey: string): Promise<InformationSource[]> {
  const params = new URLSearchParams({
    q: `${SEARCH_QUERIES[category]} saúde`,
    count: '20',
    country: 'br',
    search_lang: 'pt-br',
    safesearch: 'strict',
  });

  const response = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
    headers: { Accept: 'application/json', 'X-Subscription-Token': apiKey },
    signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Search API respondeu ${response.status}`);

  const data = (await response.json()) as BraveResponse;
  const results = data.web?.results ?? [];

  const accepted: Array<{ priority: number; source: InformationSource }> = [];
  for (const result of results) {
    if (!result.title || !result.url || isBlocked(result)) continue;
    const trusted = trustedDomainFor(result.url);
    if (!trusted) continue;
    accepted.push({
      priority: trusted.priority,
      source: {
        title: stripHtml(result.title),
        description: stripHtml(result.description ?? 'Conteúdo de fonte confiável sobre o tema.'),
        url: result.url,
        source: trusted.name,
        date: formatAge(result.page_age),
      },
    });
  }

  // sort é estável: dentro da mesma prioridade mantém a relevância da busca.
  return accepted.sort((a, b) => a.priority - b.priority).map((item) => item.source);
}

function mergeUnique(primary: InformationSource[], fallback: InformationSource[]): InformationSource[] {
  const seen = new Set<string>();
  const merged: InformationSource[] = [];
  for (const item of [...primary, ...fallback]) {
    const key = item.url.replace(/\/$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
    if (merged.length >= MAX_SOURCES) break;
  }
  return merged;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Método não permitido. Use POST.' });
    return;
  }

  let body: unknown = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = undefined;
    }
  }
  const category = typeof body === 'object' && body !== null ? (body as { category?: unknown }).category : undefined;

  if (!isIMCCategory(category)) {
    res.status(400).json({ error: 'Categoria inválida.' });
    return;
  }

  const curated = CURATED_SOURCES[category];
  const apiKey = process.env.INFORMATION_API_KEY;
  let payload: InformationResponse = { category, mode: 'curated', sources: curated };

  if (apiKey) {
    try {
      const live = await searchLive(category, apiKey);
      if (live.length > 0) {
        payload = { category, mode: 'live', sources: mergeUnique(live.slice(0, 4), curated) };
      }
    } catch (error) {
      // Falha na pesquisa não derruba a resposta: segue com as fontes curadas.
      console.error('[api/information] pesquisa online falhou:', error);
    }
  }

  // Mesma categoria → mesma resposta: cache na CDN da Vercel por 12 h.
  res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');
  res.status(200).json(payload);
}
