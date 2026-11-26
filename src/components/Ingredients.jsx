import Icon from './Icon'
import { Reveal } from './Reveal'

const INGREDIENTS = [
  { name: 'Argousier', role: 'Éclat & antioxydant', origin: 'Vallée du Rhône' },
  { name: 'Bakuchiol', role: 'Lissant, alternative au rétinol', origin: 'Inde' },
  { name: 'Rose musquée', role: 'Nourrissant & réparateur', origin: 'Chili' },
  { name: 'Aloe vera', role: 'Apaisant & hydratant', origin: 'Provence' },
]

export default function Ingredients() {
  return (
    <section id="engagements" className="scroll-mt-24 bg-ivory pb-20 lg:pb-28">
      <div className="container-x">
        <div className="grid items-center gap-10 border-t border-ink/10 pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal>
            <img
              src="/img/ingredients.jpg"
              alt="Ingrédients naturels : avocat, romarin, camomille séchée et huile dorée"
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </Reveal>

          <Reveal delay={100}>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-clay/50" />
              Transparence
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2rem,4.2vw,3rem)] font-light leading-tight">
              Ce qu'il y a dans nos flacons,
              <br />
              <span className="italic text-clay">et ce qu'il n'y a pas</span>
            </h2>
            <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-inkSoft">
              Nous publions la composition complète de chaque formule, avec la concentration exacte
              des actifs. Aucun parfum de synthèse, aucun silicone, aucune huile minérale.
            </p>

            <ul className="mt-7 divide-y divide-ink/10 border-y border-ink/10">
              {INGREDIENTS.map((ingredient) => (
                <li
                  key={ingredient.name}
                  className="group flex items-center justify-between gap-4 py-3.5"
                >
                  <div>
                    <p className="font-serif text-xl text-ink">{ingredient.name}</p>
                    <p className="text-xs text-inkSoft">{ingredient.role}</p>
                  </div>
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-inkSoft">
                    <Icon name="leaf" className="h-3.5 w-3.5 text-sage" />
                    {ingredient.origin}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
