import { CURATED_SOURCES, isIMCCategory } from '../data/sources';
import type { IMCCategory, InformationResponse, InformationSource } from '../types/imc';

const REQUEST_TIMEOUT_MS = 10000;

export class OfflineError extends Error {
  constructor() {
    super('Sem conexão com a internet.');
    this.name = 'OfflineError';
  }
}

function isSource(value: unknown): value is InformationSource {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.title === 'string' &&
    typeof v.description === 'string' &&
    typeof v.url === 'string' &&
    /^https?:\/\//.test(v.url) &&
    typeof v.source === 'string'
  );
}

function parseResponse(data: unknown, category: IMCCategory): InformationResponse {
  if (typeof data !== 'object' || data === null) throw new Error('Resposta inválida.');
  const d = data as Record<string, unknown>;
  if (!isIMCCategory(d.category) || d.category !== category || !Array.isArray(d.sources)) {
    throw new Error('Resposta inválida.');
  }
  return {
    category,
    mode: d.mode === 'live' ? 'live' : 'curated',
    sources: d.sources.filter(isSource),
  };
}

/**
 * Busca informações educativas para a categoria.
 * Envia SOMENTE a categoria — peso, altura, idade e sexo nunca saem do dispositivo.
 */
export async function fetchInformation(
  category: IMCCategory,
  signal?: AbortSignal,
): Promise<InformationResponse> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) throw new OfflineError();

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort);

  try {
    const response = await fetch('/api/information', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`API respondeu ${response.status}`);
    return parseResponse(await response.json(), category);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (typeof navigator !== 'undefined' && !navigator.onLine) throw new OfflineError();
    // Online, mas a API não respondeu (ex.: `npm run dev` sem `vercel dev`):
    // usa a seleção de fontes oficiais incluída no app.
    return { category, mode: 'curated', sources: CURATED_SOURCES[category] };
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}
