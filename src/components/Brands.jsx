import { BRANDS } from '../data/shop'
import Icon from './Icon'
import { Reveal } from './Reveal'

export default function Brands() {
  return (
    <section id="marques" className="scroll-mt-24 bg-ivory py-16 lg:py-20">
      <div className="container-x">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold/60" />
              Les maisons
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,4.2vw,3.1rem)] font-light leading-[1.05]">
              Trois maisons françaises,
              <br />
              <span className="italic text-goldDeep">une même exigence</span>
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-inkSoft">
              Nous ne référençons que des marques que nous utilisons nous-mêmes. Chaque flacon est
              sourcé auprès de la maison ou de son distributeur agréé, jamais reconditionné.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                ['shield', 'Authenticité garantie', 'Traçabilité des lots, facture fournie'],
                ['sparkle', 'Formules expertes', 'Actifs brevetés, tests cliniques disponibles'],
                ['truck', 'Stock réel', 'Expédition sous 24 h ouvrées'],
              ].map(([icon, title, text]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-goldDeep">
                    <Icon name={icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-ink">{title}</p>
                    <p className="text-[11.5px] text-inkSoft">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {BRANDS.map((brand, index) => (
              <Reveal key={brand.id} delay={index * 90}>
                <a
                  href="#boutique"
                  className="group flex h-full flex-col justify-between border border-ink/10 bg-cream/50 p-5 transition-colors hover:border-gold/60 hover:bg-cream"
                >
                  <div>
                    <p className="font-serif text-[22px] leading-tight text-ink">{brand.name}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-inkSoft">{brand.note}</p>
                  </div>
                  <span className="mt-6 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-goldDeep">
                    Voir les soins
                    <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
