import type { IMCHistory, Theme } from '../types/imc';

const HISTORY_KEY = 'imc:history';
const THEME_KEY = 'imc:theme'; // também lido pelo script inline do index.html
const INSTALL_DISMISSED_KEY = 'imc:install-dismissed';
export const HISTORY_LIMIT = 10;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* armazenamento indisponível (modo privado, cota cheia): segue sem salvar */
  }
}

function isHistoryItem(value: unknown): value is IMCHistory {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.date === 'string' &&
    typeof v.weight === 'number' &&
    typeof v.height === 'number' &&
    typeof v.imc === 'number' &&
    typeof v.classification === 'string'
  );
}

export function loadHistory(): IMCHistory[] {
  const raw = read(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isHistoryItem).slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry: IMCHistory): IMCHistory[] {
  const next = [entry, ...loadHistory()].slice(0, HISTORY_LIMIT);
  write(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* ignora */
  }
}

export function loadTheme(): Theme | null {
  const value = read(THEME_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}

export function saveTheme(theme: Theme): void {
  write(THEME_KEY, theme);
}

export function isInstallDismissed(): boolean {
  return read(INSTALL_DISMISSED_KEY) === '1';
}

export function dismissInstall(): void {
  write(INSTALL_DISMISSED_KEY, '1');
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
