import { LEAD_PRODUCTS, brandOf, finalPrice } from '../data/shop'
import { useCart } from '../hooks/useCart'
import { euro } from '../lib/format'
import Icon from './Icon'
import StockMeter from './StockMeter'

export default function LeadBanner() {
  const { addItem } = useCart()
  const leads = LEAD_PRODUCTS()

  return (
    <section className="border-b border-ink/10 bg-gradient-to-r from-cream via-ivory to-cream py-6">
      <div className="container-x">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
          <div className="shrink-0 lg:max-w-[230px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose">
              Portes d'entrée
            </p>
            <h2 className="mt-1.5 font-serif text-2xl leading-tight text-ink">
              Deux soins d'exception à moins de 16 €
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-inkSoft">
              Prix d'appel, quantités limitées. Testez la maison avant d'investir.
            </p>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            {leads.map((product) => (
              <article
                key={product.id}
                className="flex items-center gap-3 border border-ink/10 bg-ivory p-3"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-20 w-16 shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-goldDeep">
                    {brandOf(product).name}
                  </p>
                  <p className="truncate font-serif text-[16px] leading-tight">{product.name}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[14px] font-medium text-ink">{euro(finalPrice(product))}</span>
                    <span className="market-price">{euro(product.marketPrice)}</span>
                  </div>
                  <StockMeter product={product} compact />
                </div>
                <button
                  type="button"
                  onClick={() => addItem(product, 1)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-ivory transition-colors hover:bg-goldDeep"
                  aria-label={`Ajouter ${product.name} au panier`}
                >
                  <Icon name="plus" className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
