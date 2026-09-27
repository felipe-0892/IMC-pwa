import { BookOpen, ChevronDown, CircleCheck, RotateCw, Search, TriangleAlert, WifiOff } from 'lucide-react';
import { useId, useState } from 'react';
import { HEALTH_CONTENT } from '../data/healthContent';
import type { IMCCategory, InformationResponse } from '../types/imc';
import { HealthTips } from './HealthTips';
import { Sources } from './Sources';

export type InformationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: InformationResponse }
  | { status: 'error'; offline: boolean };

interface OnlineInformationProps {
  category: IMCCategory;
  state: InformationState;
  onRetry: () => void;
}

export function OnlineInformation({ category, state, onRetry }: OnlineInformationProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const content = HEALTH_CONTENT[category];

  if (state.status === 'idle') return null;

  if (state.status === 'loading') {
    return (
      <section className="card info" aria-busy="true" aria-labelledby={`${id}-title`}>
        <p className="info__status" role="status" id={`${id}-title`}>
          <Search size={18} aria-hidden="true" /> Buscando informações confiáveis...
        </p>
        <div className="skeleton" aria-hidden="true">
          <span className="skeleton__line skeleton__line--title" />
          <span className="skeleton__line" />
          <span className="skeleton__line skeleton__line--short" />
          <span className="skeleton__button" />
        </div>
      </section>
    );
  }

  if (state.status === 'error') {
    return (
      <section className="card info info--error" aria-labelledby={`${id}-title`}>
        <h2 className="info__heading" id={`${id}-title`}>
          {state.offline ? <WifiOff size={20} aria-hidden="true" /> : <TriangleAlert size={20} aria-hidden="true" />}
          Informações online indisponíveis
        </h2>
        <p role="status">
          Seu IMC foi calculado normalmente.{' '}
          {state.offline
            ? 'Não foi possível consultar informações online neste momento. Você pode tentar novamente quando estiver conectado à internet.'
            : 'Tente consultar novamente depois.'}
        </p>
        <HealthTips category={category} />
        <button type="button" className="button button--secondary" onClick={onRetry}>
          <RotateCw size={18} aria-hidden="true" />
          Tentar novamente
        </button>
      </section>
    );
  }

  const { data } = state;
  const listId = `${id}-sources`;

  return (
    <section className="card info" aria-labelledby={`${id}-title`}>
      <p className="info__status info__status--ok" role="status">
        <CircleCheck size={18} aria-hidden="true" />
        {data.mode === 'live' ? 'Informações encontradas' : 'Referências oficiais selecionadas'}
      </p>
      <h2 className="info__heading" id={`${id}-title`}>
        <BookOpen size={20} aria-hidden="true" />
        Informações para sua faixa de IMC
      </h2>
      <p className="info__headline">{content.headline}</p>
      <p className="info__intro">{content.intro}</p>

      <HealthTips category={category} />

      <button
        type="button"
        className="button button--secondary"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Ocultar fontes' : 'Ler informações'}
        <ChevronDown size={18} aria-hidden="true" className={open ? 'rotate' : undefined} />
      </button>

      {open ? <Sources id={listId} sources={data.sources} /> : null}

      <p className="info__footnote">
        {data.mode === 'live'
          ? 'Resultados de pesquisa filtrados para órgãos de saúde, sociedades médicas e universidades.'
          : 'Seleção de publicações do Ministério da Saúde, OMS e sociedades médicas.'}{' '}
        Para a pesquisa, apenas a faixa de IMC é enviada — nunca seu peso, altura ou idade.
      </p>
    </section>
  );
}
