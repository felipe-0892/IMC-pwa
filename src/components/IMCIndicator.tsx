import { useEffect, useState } from 'react';
import type { IMCCategory } from '../types/imc';
import { formatIMC } from '../utils/formatting';

const SCALE_MIN = 15;
const SCALE_MAX = 45;

const ZONES: ReadonlyArray<{ category: IMCCategory; from: number; to: number }> = [
  { category: 'baixo_peso', from: SCALE_MIN, to: 18.5 },
  { category: 'peso_normal', from: 18.5, to: 25 },
  { category: 'sobrepeso', from: 25, to: 30 },
  { category: 'obesidade_grau_1', from: 30, to: 35 },
  { category: 'obesidade_grau_2', from: 35, to: 40 },
  { category: 'obesidade_grau_3', from: 40, to: SCALE_MAX },
];

const GROUP_LABELS = [
  { label: 'Abaixo', from: SCALE_MIN, to: 18.5 },
  { label: 'Normal', from: 18.5, to: 25 },
  { label: 'Sobrepeso', from: 25, to: 30 },
  { label: 'Obesidade', from: 30, to: SCALE_MAX },
];

const BOUNDARIES = [
  { value: 18.5, label: '18,5' },
  { value: 25, label: '25' },
  { value: 30, label: '30' },
  { value: 35, label: '35' },
  { value: 40, label: '40' },
];

const pct = (value: number) =>
  ((Math.min(Math.max(value, SCALE_MIN), SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

interface IMCIndicatorProps {
  imc: number;
  classification: string;
  category: IMCCategory;
}

export function IMCIndicator({ imc, classification, category }: IMCIndicatorProps) {
  // Começa no início da régua e desliza até o valor (a transição fica no CSS).
  const [position, setPosition] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setPosition(pct(imc)));
    return () => cancelAnimationFrame(frame);
  }, [imc]);

  // Mantém o balão com o valor dentro do card nas pontas da régua.
  const shift = position < 8 ? 15 : position > 92 ? 85 : 50;

  return (
    <div
      className="indicator"
      role="img"
      aria-label={`Indicador: IMC ${formatIMC(imc)}, faixa ${classification}.`}
    >

      <div className="indicator__track" aria-hidden="true">
        {ZONES.map((zone) => (
          <span
            key={zone.category}
            className={`indicator__zone zone--${zone.category}${zone.category === category ? ' is-active' : ''}`}
            style={{ width: `${pct(zone.to) - pct(zone.from)}%` }}
          />
        ))}
        <span
          className="indicator__marker"
          style={{ left: `${position}%`, ['--shift' as string]: `${shift}%` }}
        >
          <span className="indicator__pin" />
          <span className="indicator__value">{formatIMC(imc)}</span>
        </span>
      </div>

      <div className="indicator__ticks" aria-hidden="true">
        {BOUNDARIES.map((b) => (
          <span key={b.value} style={{ left: `${pct(b.value)}%` }}>
            {b.label}
          </span>
        ))}
      </div>

      <div className="indicator__groups" aria-hidden="true">
        {GROUP_LABELS.map((g) => (
          <span key={g.label} style={{ width: `${pct(g.to) - pct(g.from)}%` }}>
            {g.label}
          </span>
        ))}
      </div>
    </div>
  );
}
