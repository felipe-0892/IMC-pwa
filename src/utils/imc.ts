import type { HeightUnit, IMCCategory, IMCClassification, IMCInput, IMCResult } from '../types/imc';

export const IMC_MIN_NORMAL = 18.5;
export const IMC_MAX_NORMAL = 24.9;

export interface IMCBand extends IMCClassification {
  category: IMCCategory;
  /** Limite superior exclusivo. */
  upTo: number;
  shortLabel: string;
  range: string;
}

export const IMC_BANDS: readonly IMCBand[] = [
  {
    category: 'baixo_peso',
    upTo: 18.5,
    classification: 'Abaixo do peso',
    shortLabel: 'Abaixo',
    range: '< 18,5',
    description: 'Seu IMC está abaixo da faixa considerada adequada para adultos.',
  },
  {
    category: 'peso_normal',
    upTo: 25,
    classification: 'Peso normal',
    shortLabel: 'Normal',
    range: '18,5 – 24,9',
    description: 'Seu IMC está na faixa considerada adequada para adultos.',
  },
  {
    category: 'sobrepeso',
    upTo: 30,
    classification: 'Sobrepeso',
    shortLabel: 'Sobrepeso',
    range: '25,0 – 29,9',
    description: 'Seu IMC está na faixa de sobrepeso.',
  },
  {
    category: 'obesidade_grau_1',
    upTo: 35,
    classification: 'Obesidade grau I',
    shortLabel: 'Obesidade I',
    range: '30,0 – 34,9',
    description: 'Seu IMC está na faixa de obesidade grau I.',
  },
  {
    category: 'obesidade_grau_2',
    upTo: 40,
    classification: 'Obesidade grau II',
    shortLabel: 'Obesidade II',
    range: '35,0 – 39,9',
    description: 'Seu IMC está na faixa de obesidade grau II.',
  },
  {
    category: 'obesidade_grau_3',
    upTo: Number.POSITIVE_INFINITY,
    classification: 'Obesidade grau III',
    shortLabel: 'Obesidade III',
    range: '≥ 40,0',
    description: 'Seu IMC está na faixa de obesidade grau III.',
  },
];

/** IMC = peso / (altura × altura). Altura em metros. */
export function calculateIMC(weight: number, heightInMeters: number): number {
  return weight / (heightInMeters * heightInMeters);
}

function findBand(imc: number): IMCBand {
  // Arredonda para 1 casa, como a tabela oficial (24,95 → 25,0 → Sobrepeso).
  const value = Math.round(imc * 10) / 10;
  return IMC_BANDS.find((band) => value < band.upTo) ?? IMC_BANDS[IMC_BANDS.length - 1];
}

export function getIMCClassification(imc: number): IMCClassification {
  const { classification, description } = findBand(imc);
  return { classification, description };
}

export function getIMCCategory(imc: number): IMCCategory {
  return findBand(imc).category;
}

/** Faixa correspondente ao IMC de 18,5 a 24,9 para a altura informada. */
export function getWeightRange(heightInMeters: number): { min: number; max: number } {
  const squared = heightInMeters * heightInMeters;
  return { min: IMC_MIN_NORMAL * squared, max: IMC_MAX_NORMAL * squared };
}

export function toMeters(value: number, unit: HeightUnit): number {
  return unit === 'cm' ? value / 100 : value;
}

export function buildIMCResult(input: IMCInput): IMCResult {
  const imc = calculateIMC(input.weight, input.height);
  const band = findBand(imc);
  const range = getWeightRange(input.height);
  return {
    imc,
    classification: band.classification,
    description: band.description,
    category: band.category,
    minWeight: range.min,
    maxWeight: range.max,
    weight: input.weight,
    height: input.height,
    isMinor: input.age !== undefined && input.age < 18,
  };
}

/* ---------- Validação ---------- */

export interface RawIMCForm {
  weight: string;
  height: string;
  heightUnit: HeightUnit;
  age: string;
}

export interface IMCFormErrors {
  weight?: string;
  height?: string;
  age?: string;
}

/** Aceita "80,5" e "80.5". Retorna NaN para texto inválido. */
export function parseDecimal(value: string): number {
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '' || !/^-?\d*\.?\d+$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}

export function validateIMCForm(form: RawIMCForm): { errors: IMCFormErrors; input?: IMCInput } {
  const errors: IMCFormErrors = {};

  const weight = parseDecimal(form.weight);
  if (form.weight.trim() === '') {
    errors.weight = 'Informe seu peso.';
  } else if (!Number.isFinite(weight) || weight <= 0) {
    errors.weight = 'Informe um peso válido, maior que zero.';
  } else if (weight > 650) {
    errors.weight = 'Confira o peso: o valor está acima do esperado.';
  }

  const rawHeight = parseDecimal(form.height);
  if (form.height.trim() === '') {
    errors.height = 'Informe sua altura.';
  } else if (!Number.isFinite(rawHeight) || rawHeight <= 0) {
    errors.height = 'Informe uma altura válida, maior que zero.';
  } else if (form.heightUnit === 'm' && rawHeight >= 50) {
    errors.height = 'Esse valor parece estar em centímetros. Escolha "Centímetros" ou digite 1,75.';
  } else if (form.heightUnit === 'cm' && rawHeight < 3) {
    errors.height = 'Esse valor parece estar em metros. Escolha "Metros" ou digite 175.';
  } else {
    const meters = toMeters(rawHeight, form.heightUnit);
    if (meters < 0.5 || meters > 2.75) {
      errors.height = 'Confira a altura: informe um valor entre 50 e 275 cm.';
    }
  }

  let age: number | undefined;
  if (form.age.trim() !== '') {
    const parsedAge = parseDecimal(form.age);
    if (!Number.isInteger(parsedAge) || parsedAge < 2 || parsedAge > 130) {
      errors.age = 'Informe a idade em anos completos, entre 2 e 130.';
    } else {
      age = parsedAge;
    }
  }

  if (errors.weight || errors.height || errors.age) return { errors };

  return { errors, input: { weight, height: toMeters(rawHeight, form.heightUnit), age } };
}
