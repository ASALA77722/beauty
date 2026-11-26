import Icon from './Icon'
import Marquee from './Marquee'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ivory">
      {/* halo décoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-sand blur-3xl opacity-70"
      />
      <div className="container-x relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-16">
        <div className="animate-fade-up">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-clay/50" />
            Cosmétiques naturels · Made in France
          </p>

          <h1 className="mt-6 font-serif text-[clamp(2.9rem,7vw,5.2rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
            La beauté
            <br />
            qui prend
            <br />
            <span className="relative inline-block italic text-clay">
              son temps
              <svg
                aria-hidden="true"
                viewBox="0 0 240 14"
                className="absolute -bottom-1 left-0 w-full text-clay/35"
                fill="none"
              >
                <path
                  d="M2 9c48-6 96-8 150-6 30 1 60 3 86 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-inkSoft">
            Des formules courtes, des actifs botaniques et des gestes simples. Maison Lumière compose
            des soins pour révéler l'éclat naturel de votre peau — sans superflu, sans compromis.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#boutique" className="btn-dark group">
              Découvrir les soins
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a href="#maison" className="btn-outline">
              Notre histoire
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-ink/10 pt-6">
            {[
              ['98 %', "d'origine naturelle"],
              ['12', 'ingrédients en moyenne'],
              ['+40 000', 'clientes conquises'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-serif text-3xl text-ink">{value}</dt>
                <dd className="mt-1 text-[11px] uppercase leading-snug tracking-[0.13em] text-inkSoft">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="group relative overflow-hidden bg-sand shadow-card">
            <img
              src="/img/hero.jpg"
              alt="Trois soins Maison Lumière posés sur un socle en travertin, lumière du matin"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
              width="900"
              height="1125"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-ivory">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/70">
                  Rituel du matin
                </p>
                <p className="mt-1 font-serif text-xl">Sérum · Crème · Huile</p>
              </div>
              <a
                href="#boutique"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory/95 text-ink transition-transform hover:scale-105"
                aria-label="Voir la collection"
              >
                <Icon name="arrow" />
              </a>
            </div>
          </div>

          <div className="absolute -left-4 top-8 hidden rotate-[-6deg] bg-ivory px-4 py-3 shadow-card sm:block">
            <div className="flex items-center gap-2">
              <Icon name="star" className="h-4 w-4 fill-clay/30 text-clay" />
              <span className="text-sm font-medium">4,9/5</span>
            </div>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-inkSoft">
              1 200 avis vérifiés
            </p>
          </div>
        </div>
      </div>

      {/* bandeau défilant */}
      <div className="border-y border-ink/10 bg-sand/60 py-3.5">
        <Marquee />
      </div>
    </section>
  )
}
