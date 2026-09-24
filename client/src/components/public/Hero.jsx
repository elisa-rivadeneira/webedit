export default function Hero({ heroTitle, heroDescription, heroImageUrl }) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[420px] items-center overflow-hidden bg-ink sm:min-h-[480px]"
    >
      {heroImageUrl && (
        <img
          src={heroImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/20" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl font-bold leading-tight text-cream sm:text-5xl">
            {heroTitle}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-cream/85 sm:text-lg">
            {heroDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
