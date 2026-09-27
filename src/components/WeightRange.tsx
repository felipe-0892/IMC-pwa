import { formatHeight, formatWeight } from '../utils/formatting';

interface WeightRangeProps {
  height: number;
  minWeight: number;
  maxWeight: number;
}

export function WeightRange({ height, minWeight, maxWeight }: WeightRangeProps) {
  return (
    <div className="weight-range">
      <p className="weight-range__label">
        Faixa de peso correspondente ao IMC de 18,5 a 24,9 para {formatHeight(height)}
      </p>
      <p className="weight-range__value">
        {formatWeight(minWeight, 1)} <span aria-label="até">—</span> {formatWeight(maxWeight, 1)}
      </p>
      <p className="weight-range__note">
        Essa faixa é uma referência matemática baseada no IMC e não representa necessariamente um
        peso-alvo individual.
      </p>
    </div>
  );
}
