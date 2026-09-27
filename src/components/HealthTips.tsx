import type { IMCCategory } from '../types/imc';
import { HEALTH_CONTENT } from '../data/healthContent';

interface HealthTipsProps {
  category: IMCCategory;
}

export function HealthTips({ category }: HealthTipsProps) {
  const content = HEALTH_CONTENT[category];
  return (
    <div className="tips">
      <p className="tips__title">Temas que vale conhecer</p>
      <ul className="tips__list">
        {content.topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
      <p className="tips__note">
        Essas informações são educativas. Converse com um profissional de saúde para definir uma
        estratégia adequada para você.
      </p>
    </div>
  );
}
