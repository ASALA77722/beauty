import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { euro } from '../lib/format'
import Icon from './Icon'

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (event) => {
    event.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="group flex flex-col">
      <div
        className="relative cursor-pointer overflow-hidden bg-sand"
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
          alt={product.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        {product.tag && (
          <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-ink">
            {product.tag}
          </span>
        )}

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full rounded-full py-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
              added ? 'bg-sage text-ivory' : 'bg-ivory/95 text-ink hover:bg-ink hover:text-ivory'
            }`}
          >
            {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-[22px] leading-tight text-ink">{product.name}</h3>
            <p className="mt-0.5 text-xs text-inkSoft">{product.subtitle}</p>
          </div>
          <span className="shrink-0 pt-1 text-sm font-medium tabular-nums">{euro(product.price)}</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-inkSoft">
          <Icon name="star" className="h-3.5 w-3.5 fill-clay/20 text-clay" />
          <span className="font-medium text-ink">{product.rating}</span>
          <span>({product.reviews})</span>
          <span className="mx-1">·</span>
          <span>{product.volume}</span>
        </div>
      </div>
    </article>
  )
}
