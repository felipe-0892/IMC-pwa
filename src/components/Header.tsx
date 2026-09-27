import { Moon, Scale, Sun } from 'lucide-react';
import type { Theme } from '../types/imc';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const isDark = theme === 'dark';
  return (
    <header className="header">
      <div className="header__inner">
        <a className="brand" href="#inicio" aria-label="Calculadora de IMC, voltar ao início">
          <span className="brand__mark" aria-hidden="true">
            <Scale size={20} strokeWidth={2.2} />
          </span>
          <span className="brand__name">Calculadora de IMC</span>
        </a>
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Usar tema claro' : 'Usar tema escuro'}
          title={isDark ? 'Tema claro' : 'Tema escuro'}
        >
          {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
