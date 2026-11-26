import { PRICE_STATS } from '../data/shop'
import { euro } from '../lib/format'
import Icon from './Icon'
import { Reveal } from './Reveal'
import storyImg from '../assets/img/story.jpg'

export default function Story() {
  return (
    <section className="bg-ivory py-16 lg:py-24">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <div className="relative">
            <img
              src={storyImg}
              alt="Rituel de soin, application d'une crème sur l'avant-bras"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover shadow-card"
            />
            <div className="absolute -bottom-5 -right-3 max-w-[210px] bg-forest p-5 text-cream shadow-soft sm:-right-6">
              <p className="font-serif text-[38px] leading-none text-gold">{euro(PRICE_STATS.averageSaving)}</p>
              <p className="mt-1.5 text-[10.5px] uppercase leading-relaxed tracking-[0.12em] text-cream/70">
                d'économie moyenne par produit
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={110}>
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" />
            Notre promesse
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4.2vw,3.2rem)] font-light leading-[1.05]">
            Des soins de parfumerie,
            <br />
            <span className="italic text-goldDeep">sans le prix de la vitrine</span>
          </h2>

          <div className="mt-5 space-y-3.5 text-[14px] leading-relaxed text-inkSoft">
            <p>
              Une crème de nuit à 219 € en magasin, c'est un prix qui inclut le loyer d'une boutique
              sur les Champs, les hôtesses et les échantillons distribués en vitrine. Nous vendons en
              ligne, en direct, avec un stock limité et des marques que nous choisissons nous-mêmes.
            </p>
            <p>
              Résultat : le même flacon, la même formule, la même fraîcheur — jusqu'à 40 % moins
              cher. Nous préférons vous le dire clairement plutôt que d'entretenir le mystère du
              « prix de luxe ».
            </p>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ['Prix magasin affiché', 'Transparence totale, toujours'],
              ['Zéro contrefaçon', 'Lots tracés, factures fournies'],
              ['Échantillons offerts', '2 par commande, choisis par vous'],
              ['Retours 30 jours', 'Même produits ouverts'],
            ].map(([title, text]) => (
              <li key={title} className="flex items-start gap-2.5">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-goldDeep" />
                <div>
                  <p className="text-[12.5px] font-medium text-ink">{title}</p>
                  <p className="text-[11px] text-inkSoft">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <a href="#boutique" className="btn-dark mt-7">
            Comparer les prix
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
