import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/public-sans';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

// Service Worker: cache do app para uso offline, atualizado automaticamente.
registerSW({ immediate: true });

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
