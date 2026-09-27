import { Scale, WifiOff } from 'lucide-react';

interface FooterProps {
  online: boolean;
}

export function Footer({ online }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__brand">
          <Scale size={18} aria-hidden="true" /> Calculadora de IMC
        </p>
        <p className="footer__meta">
          Funciona offline • PWA
          {!online ? (
            <span className="footer__offline" role="status">
              <WifiOff size={14} aria-hidden="true" /> Você está offline
            </span>
          ) : null}
        </p>
        <p className="footer__copy">© {new Date().getFullYear()} Calculadora de IMC</p>
      </div>
    </footer>
  );
}
