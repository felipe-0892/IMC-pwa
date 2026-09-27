export type IMCCategory =
  | 'baixo_peso'
  | 'peso_normal'
  | 'sobrepeso'
  | 'obesidade_grau_1'
  | 'obesidade_grau_2'
  | 'obesidade_grau_3';

export type HeightUnit = 'cm' | 'm';

export type Sex = 'feminino' | 'masculino' | 'nao_informado';

export type Theme = 'light' | 'dark';

export interface IMCClassification {
  classification: string;
  description: string;
}

export interface IMCInput {
  weight: number;
  /** Altura sempre em metros. */
  height: number;
  age?: number;
}

export interface IMCResult {
  imc: number;
  classification: string;
  description: string;
  minWeight: number;
  maxWeight: number;
  category: IMCCategory;
  weight: number;
  height: number;
  /** true quando a idade informada é menor que 18 anos. */
  isMinor: boolean;
}

export interface IMCHistory {
  id: string;
  date: string;
  weight: number;
  height: number;
  imc: number;
  classification: string;
}

export interface InformationSource {
  title: string;
  description: string;
  url: string;
  source: string;
  date?: string;
}

export interface InformationResponse {
  category: IMCCategory;
  sources: InformationSource[];
  /** live = pesquisa online filtrada; curated = seleção de referências oficiais. */
  mode: 'live' | 'curated';
}
