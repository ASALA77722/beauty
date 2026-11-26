import heroImg from '../assets/img/hero-luxe.jpg'
import { FLASH_OFFER, PRICE_STATS, PRODUCTS, finalPrice } from '../data/shop'
import { discountPercent, euro } from '../lib/format'
import Icon from './Icon'
import Marquee from './Marquee'

const FEATURED = PRODUCTS[0]

export default function Hero() {
  const saving = Math.round(FEATURED.marketPrice - finalPrice(FEATURED))
  const off = discountPercent(FEATURED.marketPrice, finalPrice(FEATURED))

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

          {/* bandeau de remise phare */}
          <div className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-rose/25 bg-rose/8 px-4 py-2.5">
            <span className="badge bg-rose px-2.5 py-1 text-[11px] font-bold text-ivory">
              −{off} %
            </span>
            <span className="text-[12.5px] font-medium text-ink">
              sur le prix constaté en magasin
            </span>
            <span className="text-[11.5px] text-inkSoft">· {euro(saving)} d'économie</span>
          </div>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-inkSoft">
            Jeanne Piaubert, Stendhal, Laboratoires de Biarritz : les soins des grandes maisons
            françaises, authentiques et tracés, jusqu'à{' '}
            <strong className="font-semibold text-ink">−{PRICE_STATS.worst} %</strong> du prix
            constaté en magasin.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#boutique" className="btn-gold group">
              Voir les soins
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#offres" className="btn-outline">
              Les offres du moment
            </a>
          </div>

          <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-ink/10 pt-6">
            {[
              [`−${PRICE_STATS.average} %`, 'vs prix magasin'],
              ['100 %', 'produits authentiques'],
              ['24 h', 'expédition France'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-serif text-[28px] leading-none text-ink">{value}</dt>
                <dd className="mt-1.5 text-[11px] uppercase leading-snug tracking-[0.12em] text-inkSoft">
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

          {/* carte produit flottante : la remise est le premier élément lu */}
          <div className="absolute -bottom-6 left-3 right-3 bg-ivory p-4 shadow-soft sm:-left-6 sm:right-auto sm:w-[300px]">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-goldDeep">Best-seller</p>
              <span className="badge bg-rose px-2 py-0.5 text-[11px] font-bold text-ivory">
                −{off} %
              </span>
            </div>
            <p className="mt-1 font-serif text-lg leading-tight text-ink">{FEATURED.name}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[20px] font-medium text-ink">{euro(finalPrice(FEATURED))}</span>
              <span className="market-price text-[12px]">{euro(FEATURED.marketPrice)}</span>
            </div>
            <p className="mt-1 text-[12px] font-semibold text-rose">Économisez {euro(saving)}</p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-y border-ink/10 bg-cream/70 py-3.5 lg:mt-20">
        <Marquee />
      </div>
    </section>
  )
}
