import { FLASH_OFFER, brandOf, finalPrice, productRating } from '../data/shop'
import { useCart } from '../hooks/useCart'
import { discountPercent, euro } from '../lib/format'
import Icon from './Icon'
import Stars, { formatRating } from './Stars'
import StockMeter from './StockMeter'

/** Bloc prix : le prix payé domine, l'économie est chiffrée en gros. */
export function PriceBlock({ product, size = 'card' }) {
  const price = finalPrice(product)
  const saving = Math.round((product.marketPrice - price) * 100) / 100
  const off = discountPercent(product.marketPrice, price)
  const big = size === 'modal'

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-end gap-x-2.5 gap-y-1">
        <span
          className={`font-medium leading-none text-ink ${big ? 'text-3xl' : 'text-[21px]'}`}
        >
          {euro(price)}
        </span>
        <span className={`market-price ${big ? 'text-[13px]' : 'text-[12px]'}`}>
          {euro(product.marketPrice)}
        </span>
        <span
          className={`badge ml-auto shrink-0 bg-rose text-ivory ${
            big ? 'px-2.5 py-1 text-[11px]' : ''
          }`}
        >
          −{off} %
        </span>
      </div>
      <p
        className={`mt-1.5 flex items-center gap-1.5 font-semibold text-rose ${
          big ? 'text-[13px]' : 'text-[12.5px]'
        }`}
      >
        <Icon name="check" className={big ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
        Vous économisez {euro(saving)}
      </p>
      <p className="mt-0.5 text-[10.5px] text-inkSoft">
        soit −{FLASH_OFFER.percent} % de lancement en plus du prix magasin
      </p>
    </div>
  )
}

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart()
  const brand = brandOf(product)
  const { average, count } = productRating(product.id)

  return (
    <article className="group flex h-full flex-col border border-ink/8 bg-ivory transition-all duration-500 hover:border-gold/50 hover:shadow-card">
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

        {/* étiquettes secondaires : la remise est déjà dans le bloc prix */}
        <div className="absolute left-0 top-0 flex flex-col items-start gap-1 p-2.5">
          {product.lead && (
            <span className="badge bg-gold px-2 py-1 text-[10px] text-ink shadow-sm">
              Prix d'appel
            </span>
          )}
          {product.bestseller && !product.lead && (
            <span className="badge bg-ivory/95 px-2 py-1 text-[10px] text-ink">Best-seller</span>
          )}
          {product.isNew && (
            <span className="badge bg-forest px-2 py-1 text-[10px] text-cream">Nouveau</span>
          )}
        </div>

        <div className="absolute inset-x-2.5 bottom-2.5 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              addItem(product, 1)
            }}
            className="w-full rounded-full bg-ink/92 py-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur transition-colors hover:bg-goldDeep"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-goldDeep">{brand.name}</p>
        <h3 className="mt-1 font-serif text-[19px] leading-tight text-ink">{product.name}</h3>
        <p className="mt-0.5 text-[11px] text-inkSoft">
          {product.volume} · {product.concern}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <Stars value={average} className="h-3 w-3" />
          <span className="text-[10.5px] text-inkSoft">
            {formatRating(average)} ({count.toLocaleString('fr-FR')} avis)
          </span>
        </div>

        <PriceBlock product={product} />

        <div className="mt-auto pt-3">
          <StockMeter product={product} compact />
        </div>
      </div>
    </article>
  )
}
