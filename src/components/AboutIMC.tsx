export function AboutIMC() {
  return (
    <section className="section" aria-labelledby="about-title">
      <h2 id="about-title" className="section__title">
        Entenda seu IMC
      </h2>
      <div className="accordion">
        <details>
          <summary>O que é IMC?</summary>
          <p>
            O Índice de Massa Corporal relaciona o peso com a altura. É usado por profissionais de
            saúde e pela Organização Mundial da Saúde como uma forma rápida de estimar se o peso de um
            adulto está dentro, abaixo ou acima da faixa associada a menor risco para a saúde.
          </p>
        </details>
        <details>
          <summary>Como é calculado?</summary>
          <p>Divide-se o peso (em kg) pela altura (em metros) elevada ao quadrado:</p>
          <p className="formula">IMC = peso ÷ altura²</p>
          <p>Exemplo: 80 kg e 1,75 m → 80 ÷ (1,75 × 1,75) = 26,12.</p>
        </details>
        <details>
          <summary>O IMC é suficiente?</summary>
          <p>Não. O IMC é um indicador geral e tem limites:</p>
          <ul>
            <li>não mede diretamente a gordura corporal;</li>
            <li>não diferencia completamente massa muscular de gordura;</li>
            <li>não mostra como a gordura está distribuída no corpo;</li>
            <li>não substitui a avaliação de um profissional de saúde.</li>
          </ul>
          <p>
            Medidas como a circunferência da cintura, exames e o histórico de saúde ajudam a completar
            essa avaliação.
          </p>
        </details>
      </div>
    </section>
  );
}
