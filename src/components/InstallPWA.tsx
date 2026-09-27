import { Share, Smartphone, SquarePlus, X } from 'lucide-react';
import { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { dismissInstall, isInstallDismissed } from '../utils/storage';

export function InstallPWA() {
  const { canInstall, showIOSInstructions, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(isInstallDismissed);

  if (dismissed || (!canInstall && !showIOSInstructions)) return null;

  const close = () => {
    dismissInstall();
    setDismissed(true);
  };

  return (
    <aside className="install" aria-labelledby="install-title">
      <span className="install__icon" aria-hidden="true">
        <Smartphone size={22} />
      </span>
      <div className="install__content">
        <h2 id="install-title" className="install__title">
          Instale o aplicativo
        </h2>
        {canInstall ? (
          <>
            <p>Tenha a Calculadora de IMC sempre disponível no seu celular, mesmo sem internet.</p>
            <button type="button" className="button button--primary" onClick={install}>
              Instalar aplicativo
            </button>
          </>
        ) : (
          <>
            <p>Para instalar no iPhone:</p>
            <ol className="install__steps">
              <li>
                Toque em Compartilhar <Share size={16} aria-label="(ícone de compartilhar)" />.
              </li>
              <li>
                Escolha “Adicionar à Tela de Início” <SquarePlus size={16} aria-hidden="true" />.
              </li>
              <li>Confirme a instalação.</li>
            </ol>
          </>
        )}
      </div>
      <button type="button" className="icon-button install__close" onClick={close} aria-label="Dispensar aviso de instalação">
        <X size={18} aria-hidden="true" />
      </button>
    </aside>
  );
}
