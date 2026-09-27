import type { IMCCategory } from '../types/imc';
import { IMC_BANDS } from '../utils/imc';

interface IMCTableProps {
  current?: IMCCategory;
}

export function IMCTable({ current }: IMCTableProps) {
  return (
    <section className="section" aria-labelledby="table-title">
      <h2 id="table-title" className="section__title">
        Classificação do IMC
      </h2>
      <p className="section__lead">Referência para adultos (a partir de 18 anos).</p>
      <div className="table-wrap" tabIndex={0} role="region" aria-labelledby="table-title">
        <table className="imc-table">
          <thead>
            <tr>
              <th scope="col">IMC</th>
              <th scope="col">Classificação</th>
            </tr>
          </thead>
          <tbody>
            {IMC_BANDS.map((band) => {
              const active = band.category === current;
              return (
                <tr key={band.category} className={active ? 'is-current' : undefined} aria-current={active ? 'true' : undefined}>
                  <td className="imc-table__range">{band.range}</td>
                  <td>
                    <span className={`dot zone--${band.category}`} aria-hidden="true" />
                    {band.classification}
                    {active ? <span className="imc-table__you">Seu resultado</span> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
