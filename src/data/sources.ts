/**
 * Módulo compartilhado entre o frontend (fallback) e a função serverless /api/information.
 * Não importe nada de runtime aqui além de tipos: a API o carrega diretamente no Node.
 */
import type { IMCCategory, InformationSource } from '../types/imc';

export const IMC_CATEGORIES: readonly IMCCategory[] = [
  'baixo_peso',
  'peso_normal',
  'sobrepeso',
  'obesidade_grau_1',
  'obesidade_grau_2',
  'obesidade_grau_3',
];

export function isIMCCategory(value: unknown): value is IMCCategory {
  return typeof value === 'string' && (IMC_CATEGORIES as readonly string[]).includes(value);
}

/** Consultas usadas na pesquisa online (seção 21 da especificação). */
export const SEARCH_QUERIES: Record<IMCCategory, string> = {
  baixo_peso: 'ganho de peso saudável baixo peso alimentação atividade física',
  peso_normal: 'manutenção peso saudável alimentação atividade física',
  sobrepeso: 'perda de peso saudável sobrepeso alimentação atividade física',
  obesidade_grau_1: 'tratamento obesidade alimentação atividade física diretrizes',
  obesidade_grau_2: 'tratamento obesidade estratégias perda de peso diretrizes',
  obesidade_grau_3: 'tratamento obesidade grave diretrizes acompanhamento profissional',
};

/**
 * Domínios aceitos, em ordem de prioridade (menor = mais prioritário).
 * Um resultado só é exibido se o host terminar com um destes domínios.
 */
export const TRUSTED_DOMAINS: ReadonlyArray<{ domain: string; name: string; priority: number }> = [
  { domain: 'saude.gov.br', name: 'Ministério da Saúde', priority: 1 },
  { domain: 'gov.br', name: 'Governo Federal', priority: 1 },
  { domain: 'who.int', name: 'Organização Mundial da Saúde', priority: 2 },
  { domain: 'paho.org', name: 'OPAS/OMS', priority: 2 },
  { domain: 'endocrino.org.br', name: 'SBEM', priority: 3 },
  { domain: 'abeso.org.br', name: 'ABESO', priority: 4 },
  { domain: 'fiocruz.br', name: 'Fiocruz', priority: 5 },
  { domain: 'usp.br', name: 'Universidade de São Paulo', priority: 5 },
  { domain: 'unifesp.br', name: 'Unifesp', priority: 5 },
  { domain: 'unicamp.br', name: 'Unicamp', priority: 5 },
  { domain: 'ufmg.br', name: 'UFMG', priority: 5 },
  { domain: 'ufrgs.br', name: 'UFRGS', priority: 5 },
  { domain: 'ebserh.gov.br', name: 'Hospitais Universitários (Ebserh)', priority: 6 },
  { domain: 'einstein.br', name: 'Hospital Israelita Albert Einstein', priority: 6 },
  { domain: 'hospitalsiriolibanes.org.br', name: 'Hospital Sírio-Libanês', priority: 6 },
  { domain: 'scielo.br', name: 'SciELO', priority: 7 },
  { domain: 'nih.gov', name: 'National Institutes of Health', priority: 7 },
  { domain: 'cdc.gov', name: 'CDC', priority: 7 },
  { domain: 'nhs.uk', name: 'NHS', priority: 7 },
];

/** Termos que indicam conteúdo promocional ou extremo — descartados mesmo em domínios confiáveis. */
export const BLOCKED_TERMS: readonly string[] = [
  'suplemento',
  'milagr',
  'emagreça rápido',
  'emagrecer rápido',
  'detox',
  'compre',
  'promoção',
  'cupom',
  'jejum extremo',
];

const MS = 'Ministério da Saúde';
const OMS = 'Organização Mundial da Saúde';

const GUIA_ALIMENTAR: InformationSource = {
  title: 'Guia Alimentar para a População Brasileira',
  description:
    'Publicação oficial com princípios para uma alimentação adequada e saudável, baseada em alimentos in natura e minimamente processados.',
  url: 'https://bvsms.saude.gov.br/bvs/publicacoes/guia_alimentar_populacao_brasileira_2ed.pdf',
  source: MS,
  date: '2014',
};

const GUIA_ATIVIDADE: InformationSource = {
  title: 'Guia de Atividade Física para a População Brasileira',
  description:
    'Recomendações sobre quantidade, intensidade e tipos de atividade física (aeróbica, de força e de equilíbrio) para cada fase da vida.',
  url: 'https://bvsms.saude.gov.br/bvs/publicacoes/guia_atividade_fisica_populacao_brasileira.pdf',
  source: MS,
  date: '2021',
};

const OMS_DIETA: InformationSource = {
  title: 'Healthy diet (Alimentação saudável)',
  description:
    'Ficha informativa da OMS sobre os componentes de uma alimentação saudável ao longo da vida. Conteúdo em inglês.',
  url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
  source: OMS,
};

const OMS_ATIVIDADE: InformationSource = {
  title: 'Physical activity (Atividade física)',
  description:
    'Ficha informativa da OMS com os benefícios da atividade física e as recomendações globais por faixa etária. Conteúdo em inglês.',
  url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
  source: OMS,
};

const OMS_OBESIDADE: InformationSource = {
  title: 'Obesity and overweight (Obesidade e sobrepeso)',
  description:
    'Ficha informativa da OMS sobre causas, riscos à saúde, prevenção e manejo do sobrepeso e da obesidade. Conteúdo em inglês.',
  url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
  source: OMS,
};

const OMS_MALNUTRICAO: InformationSource = {
  title: 'Malnutrition (Má nutrição)',
  description:
    'Ficha informativa da OMS que inclui a desnutrição e o baixo peso, suas causas e consequências para a saúde. Conteúdo em inglês.',
  url: 'https://www.who.int/news-room/fact-sheets/detail/malnutrition',
  source: OMS,
};

const PESO_SAUDAVEL: InformationSource = {
  title: 'Programa Peso Saudável',
  description:
    'Iniciativa do Ministério da Saúde com orientações sobre alimentação, atividade física e cuidado para alcançar e manter um peso saudável.',
  url: 'https://www.gov.br/saude/pt-br/composicao/saps/promocao-da-saude/programa-peso-saudavel',
  source: MS,
};

const SUS_OBESIDADE: InformationSource = {
  title: 'Cuidados e ações disponíveis no SUS para o tratamento da obesidade',
  description:
    'Explica que a obesidade é multifatorial e apresenta as ações de prevenção e cuidado oferecidas pelo SUS, especialmente na Atenção Primária.',
  url: 'https://agenciagov.ebc.com.br/noticias/202510/cuidados-e-acoes-disponiveis-no-sus-para-o-tratamento-da-obesidade',
  source: 'Agência Gov / Ministério da Saúde',
  date: '11/10/2025',
};

const ABESO: InformationSource = {
  title: 'ABESO — Diretrizes e informações sobre obesidade',
  description:
    'Associação Brasileira para o Estudo da Obesidade e da Síndrome Metabólica: diretrizes clínicas, posicionamentos e materiais educativos.',
  url: 'https://abeso.org.br/',
  source: 'ABESO',
};

const ABESO_2016: InformationSource = {
  title: 'Diretrizes Brasileiras de Obesidade (ABESO, 4ª edição)',
  description:
    'Diretriz sobre diagnóstico e tratamento dietético, comportamental, farmacológico e cirúrgico do sobrepeso e da obesidade.',
  url: 'https://portaldeboaspraticas.iff.fiocruz.br/biblioteca/diretrizes-brasileiras-de-obesidade-2016-abeso/',
  source: 'Fiocruz / ABESO',
  date: '2016',
};

const SBEM: InformationSource = {
  title: 'Sociedade Brasileira de Endocrinologia e Metabologia',
  description:
    'Informações para o público sobre obesidade, metabolismo e quando procurar um endocrinologista.',
  url: 'https://www.endocrino.org.br/',
  source: 'SBEM',
};

export const CURATED_SOURCES: Record<IMCCategory, InformationSource[]> = {
  baixo_peso: [GUIA_ALIMENTAR, OMS_MALNUTRICAO, GUIA_ATIVIDADE, OMS_DIETA],
  peso_normal: [GUIA_ALIMENTAR, GUIA_ATIVIDADE, PESO_SAUDAVEL, OMS_ATIVIDADE],
  sobrepeso: [PESO_SAUDAVEL, GUIA_ALIMENTAR, GUIA_ATIVIDADE, OMS_OBESIDADE],
  obesidade_grau_1: [SUS_OBESIDADE, OMS_OBESIDADE, ABESO_2016, GUIA_ALIMENTAR, GUIA_ATIVIDADE],
  obesidade_grau_2: [SUS_OBESIDADE, ABESO_2016, OMS_OBESIDADE, SBEM, GUIA_ATIVIDADE],
  obesidade_grau_3: [SUS_OBESIDADE, ABESO_2016, ABESO, SBEM, OMS_OBESIDADE],
};
