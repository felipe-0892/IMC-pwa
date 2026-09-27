export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <svg className="hero__scale" viewBox="0 0 240 40" aria-hidden="true" focusable="false">
        {Array.from({ length: 31 }, (_, i) => (
          <line
            key={i}
            x1={i * 8}
            x2={i * 8}
            y1={i % 5 === 0 ? 8 : 18}
            y2={32}
            className={i >= 7 && i <= 12 ? 'hero__tick hero__tick--on' : 'hero__tick'}
          />
        ))}
      </svg>
      <h1 id="hero-title" className="hero__title">
        Descubra seu IMC
      </h1>
      <p className="hero__text">
        Calcule seu Índice de Massa Corporal de forma rápida, simples e gratuita.
      </p>
    </section>
  );
}
