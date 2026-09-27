import { ExternalLink } from 'lucide-react';
import type { InformationSource } from '../types/imc';

interface SourcesProps {
  id: string;
  sources: InformationSource[];
}

export function Sources({ id, sources }: SourcesProps) {
  if (sources.length === 0) {
    return (
      <p id={id} className="muted">
        Nenhuma fonte confiável foi encontrada agora. Tente novamente mais tarde.
      </p>
    );
  }

  return (
    <ul id={id} className="sources">
      {sources.map((item) => (
        <li key={item.url} className="source">
          <p className="source__origin">
            {item.source}
            {item.date ? <span className="source__date">{item.date}</span> : null}
          </p>
          <h4 className="source__title">{item.title}</h4>
          <p className="source__desc">{item.description}</p>
          <a className="source__link" href={item.url} target="_blank" rel="noopener noreferrer">
            Ler fonte original
            <ExternalLink size={15} aria-hidden="true" />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
