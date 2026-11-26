import { FLASH_OFFER, brandOf, finalPrice } from '../data/shop'
import { useCart } from '../hooks/useCart'
import { discountPercent, euro } from '../lib/format'
import Icon from './Icon'
import Stars from './Stars'
import StockMeter from './StockMeter'

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart()
  const brand = brandOf(product)
  const price = finalPrice(product)
  const off = discountPercent(product.marketPrice, price)
  const launchSaving = Math.round((product.price - price) * 100) / 100

  return (
    <article className="group flex flex-col">
      <div
        className="relative cursor-pointer overflow-hidden bg-cream"
        onClick={() => onOpen(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(product)
          }
        }}
        aria-label={`Voir la fiche de ${product.name}`}
      >
        <img
          src={product.image}
          alt={`${brand.name} — ${product.name}`}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && <span className="badge bg-rose text-ivory">−{off} %</span>}
          {product.bestseller && <span className="badge bg-ivory/95 text-ink">Best-seller</span>}
          {product.isNew && <span className="badge bg-forest text-cream">Nouveau</span>}
          {product.lead && <span className="badge bg-gold text-ink">Prix d'appel</span>}
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              addItem(product, 1)
            }}
            className="w-full rounded-full bg-ink/90 py-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur transition-colors hover:bg-goldDeep"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-goldDeep">{brand.name}</p>
        <h3 className="mt-1 font-serif text-[19px] leading-tight text-ink">{product.name}</h3>
        <p className="mt-0.5 text-[11px] text-inkSoft">
          {product.volume} · {product.concern}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <Stars value={product.rating} className="h-3 w-3" />
          <span className="text-[10.5px] text-inkSoft">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[17px] font-medium text-ink">{euro(price)}</span>
          <span className="market-price">{euro(product.marketPrice)}</span>
          <span className="text-[10.5px] font-medium text-sage">
            −{euro(Math.round((product.marketPrice - price) * 100) / 100)}
          </span>
        </div>

        {launchSaving > 0 && (
          <p className="mt-1 text-[10.5px] text-goldDeep">
            {FLASH_OFFER.label} −{FLASH_OFFER.percent} % inclus
          </p>
        )}

        <StockMeter product={product} compact />
        <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-inkSoft">
          <Icon name="truck" className="h-3.5 w-3.5 text-gold" />
          Expédié en 24 h · Retours 30 j
        </p>
      </div>
    </article>
  )
}
