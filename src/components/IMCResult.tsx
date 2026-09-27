import { TriangleAlert } from 'lucide-react';
import { forwardRef } from 'react';
import type { IMCResult as IMCResultData } from '../types/imc';
import { formatHeight, formatIMC, formatWeight } from '../utils/formatting';
import { IMCIndicator } from './IMCIndicator';
import { WeightRange } from './WeightRange';

interface IMCResultProps {
  result: IMCResultData;
}

export const IMCResult = forwardRef<HTMLHeadingElement, IMCResultProps>(function IMCResult(
  { result },
  headingRef,
) {
  return (
    <section
      className={`card result result--${result.isMinor ? 'minor' : result.category}`}
      aria-labelledby="result-title"
    >
      <h2 id="result-title" className="result__eyebrow" ref={headingRef} tabIndex={-1}>
        Seu IMC
      </h2>

      <p className="result__value" aria-live="polite">
        <span className="sr-only">Seu IMC é </span>
        {formatIMC(result.imc)}
      </p>

      {result.isMinor ? (
        <div className="notice notice--warning" role="note">
          <TriangleAlert size={20} aria-hidden="true" />
          <div>
            <p className="notice__title">Classificação para adultos não aplicada</p>
            <p>
              Para crianças e adolescentes, o IMC é interpretado com curvas de crescimento por idade e
              sexo, e não pela tabela de adultos. Converse com um pediatra ou profissional de saúde
              para avaliar esse resultado.
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="result__class">{result.classification}</p>
          <p className="result__desc">{result.description}</p>
          <IMCIndicator imc={result.imc} classification={result.classification} category={result.category} />
          <WeightRange height={result.height} minWeight={result.minWeight} maxWeight={result.maxWeight} />
        </>
      )}

      <p className="result__inputs">
        Calculado com {formatWeight(result.weight)} e {formatHeight(result.height)}
      </p>
    </section>
  );
});
