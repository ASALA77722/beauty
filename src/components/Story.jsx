import Icon from './Icon'
import { Reveal } from './Reveal'

export default function Story() {
  return (
    <section id="maison" className="scroll-mt-24 bg-sand py-20 lg:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative">
            <img
              src="/img/story.jpg"
              alt="Application d'une crème sur un avant-bras, lumière naturelle"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover shadow-card"
            />
            <div className="absolute -bottom-6 -right-4 hidden max-w-[220px] bg-ivory p-5 shadow-soft sm:block lg:-right-8">
              <p className="font-serif text-[42px] leading-none text-clay">2019</p>
              <p className="mt-2 text-[11px] uppercase leading-relaxed tracking-[0.14em] text-inkSoft">
                Naissance de la maison, dans un atelier de Grasse
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-clay/50" />
            La maison
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.1rem,4.4vw,3.3rem)] font-light leading-[1.05]">
            Une famille,
            <br />
            <span className="italic text-clay">un atelier</span>, sept formules
          </h2>

          <div className="mt-6 space-y-4 text-[14.5px] leading-relaxed text-inkSoft">
            <p>
              Tout a commencé par une éviction : celle de Claire et Antoine, deux pharmaciens
              lassés des étiquettes illisibles. Ils ont ouvert leur atelier à Grasse avec une
              conviction simple — une peau n'a pas besoin de cinquante ingrédients, mais des bons.
            </p>
            <p>
              Six ans plus tard, nous produisons toujours en petites séries, à la main, avec des
              actifs achetés directement à des producteurs de la région. Les formules n'ont pas
              changé de philosophie : courtes, lisibles, efficaces.
            </p>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ['Fabriqué en France', 'Atelier familial de Grasse'],
              ['Producteurs locaux', 'Achats directs, circuits courts'],
              ['Petites séries', 'Fraîcheur garantie, zéro surstock'],
              ['Rechargeable', 'Verre teinté et pots en terre'],
            ].map(([title, text]) => (
              <li key={title} className="flex items-start gap-3">
                <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-sage" />
                <div>
                  <p className="text-sm font-medium text-ink">{title}</p>
                  <p className="text-xs text-inkSoft">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <a href="#boutique" className="btn-dark mt-9">
            Découvrir nos soins
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
