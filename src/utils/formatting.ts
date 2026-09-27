const cache = new Map<number, Intl.NumberFormat>();

function formatter(decimals: number): Intl.NumberFormat {
  let f = cache.get(decimals);
  if (!f) {
    f = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    cache.set(decimals, f);
  }
  return f;
}

/** 26.1224 → "26,12" */
export function formatIMC(imc: number): string {
  return formatter(2).format(imc);
}

/** 80 → "80 kg"; 80.5 → "80,5 kg" */
export function formatWeight(kg: number, decimals?: number): string {
  const d = decimals ?? (Number.isInteger(kg) ? 0 : 1);
  return `${formatter(d).format(kg)} kg`;
}

/** 1.75 → "1,75 m" */
export function formatHeight(meters: number): string {
  return `${formatter(2).format(meters)} m`;
}

/** ISO → "27/09/2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/** ISO → "14:05" */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
}
