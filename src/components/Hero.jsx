import { FLASH_OFFER, PRICE_STATS, PRODUCTS } from '../data/shop'
import { discountPercent, euro } from '../lib/format'
import Icon from './Icon'
import Marquee from './Marquee'
import heroImg from '../assets/img/hero-luxe.jpg'

const FEATURED = PRODUCTS[0]

export default function Hero() {
  const saving = Math.round(FEATURED.marketPrice - FEATURED.price)

  return (
    <section id="top" className="relative overflow-hidden bg-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-cream blur-3xl"
      />
      <div className="container-x relative grid items-center gap-12 pb-14 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-20">
        <div className="animate-fade-up">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-gold/60" />
            Parfumerie beauté en ligne · Marques françaises
          </p>

          <h1 className="mt-6 font-serif text-[clamp(2.7rem,6.6vw,4.9rem)] font-light leading-[0.97] tracking-[-0.02em] text-ink">
            Le luxe
            <br />
            au juste
            <br />
            <span className="relative inline-block italic text-goldDeep">
              prix
              <svg aria-hidden="true" viewBox="0 0 200 12" className="absolute -bottom-1 left-0 w-full text-gold/50" fill="none">
                <path d="M2 8c40-5 80-7 120-5 26 1 50 3 76 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-inkSoft">
            Jeanne Piaubert, Stendhal, Laboratoires de Biarritz : les soins des grandes maisons
            françaises, authentiques et tracés, jusqu'à{' '}
            <strong className="font-medium text-ink">−{PRICE_STATS.worst} %</strong> du prix constaté
            en magasin.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#boutique" className="btn-gold group">
              Voir les soins
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#offres" className="btn-outline">
              Les offres du moment
            </a>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ink/10 pt-6">
            {[
              [`−${PRICE_STATS.average} %`, 'vs prix magasin'],
              ['100 %', 'produits authentiques'],
              ['48 h', 'livraison France'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-serif text-[28px] leading-none text-ink">{value}</dt>
                <dd className="mt-1.5 text-[10.5px] uppercase leading-snug tracking-[0.12em] text-inkSoft">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="group relative overflow-hidden bg-cream shadow-card">
            <img
              src={heroImg}
              alt="Le baume Jeanne Piaubert, le sérum Stendhal et le sérum anti-taches Biarritz"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
              width="900"
              height="1125"
            />
            <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
              <span className="badge bg-forest text-cream">Sélection beauté</span>
              <span className="badge bg-gold text-ink">
                {FLASH_OFFER.label} −{FLASH_OFFER.percent} %
              </span>
            </div>
          </div>

          {/* carte produit flottante */}
          <div className="absolute -bottom-6 left-3 right-3 bg-ivory p-4 shadow-soft sm:-left-6 sm:right-auto sm:w-[292px]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-goldDeep">Best-seller</p>
            <p className="mt-1 font-serif text-lg leading-tight text-ink">
              {FEATURED.name}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-medium text-ink">{euro(FEATURED.price)}</span>
              <span className="market-price">{euro(FEATURED.marketPrice)}</span>
              <span className="badge ml-auto bg-rose/15 text-rose">
                −{discountPercent(FEATURED.marketPrice, FEATURED.price)} %
              </span>
            </div>
            <p className="mt-1 text-[11px] text-sage">Économisez {euro(saving)} vs magasin</p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-y border-ink/10 bg-cream/70 py-3.5 lg:mt-20">
        <Marquee />
      </div>
    </section>
  )
}
