import { useEffect, useRef, useState } from 'react'
import { useCart } from '../hooks/useCart'
import { euro } from '../lib/format'
import Icon from './Icon'

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [showInci, setShowInci] = useState(false)
  const dialogRef = useRef(null)
  const addButtonRef = useRef(null)

  useEffect(() => {
    if (!product) return
    setQty(1)
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    addButtonRef.current?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink/50 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-ivory shadow-soft animate-fade-up sm:rounded-sm"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-sm transition-colors hover:bg-sand"
          aria-label="Fermer la fiche produit"
        >
          <Icon name="close" />
        </button>

        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative bg-sand">
            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full object-cover md:h-full"
            />
            {product.tag && (
              <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em]">
                {product.tag}
              </span>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-9">
            <p className="eyebrow">{product.category}</p>
            <h2 className="mt-2 font-serif text-4xl leading-tight">{product.name}</h2>
            <p className="mt-1 text-sm text-inkSoft">{product.subtitle}</p>

            <div className="mt-3 flex items-center gap-2 text-xs text-inkSoft">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon
                    key={index}
                    name="star"
                    className={`h-3.5 w-3.5 ${
                      index < Math.round(product.rating)
                        ? 'fill-clay/25 text-clay'
                        : 'text-ink/20'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-ink">{product.rating}</span>
              <span>· {product.reviews} avis</span>
            </div>

            <p className="mt-5 flex items-baseline gap-2">
              <span className="font-serif text-3xl">{euro(product.price)}</span>
              <span className="text-xs text-inkSoft">{product.volume}</span>
            </p>

            <p className="mt-4 text-sm leading-relaxed text-inkSoft">{product.description}</p>

            <ul className="mt-5 space-y-2">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2.5 text-[13px] text-ink">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                  {detail}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {product.skin.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-ink/15 px-3 py-1 text-[11px] text-inkSoft"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 border-t border-ink/10 pt-4">
              <button
                type="button"
                onClick={() => setShowInci((value) => !value)}
                aria-expanded={showInci}
                className="flex w-full items-center justify-between gap-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-inkSoft transition-colors hover:text-ink"
              >
                Composition complète (INCI)
                <Icon
                  name="chevron"
                  className={`h-4 w-4 transition-transform duration-300 ${
                    showInci ? 'rotate-180 text-clay' : ''
                  }`}
                />
              </button>
              {showInci && (
                <p className="mt-3 text-[11.5px] leading-relaxed text-inkSoft animate-fade-in">
                  {product.inci}
                </p>
              )}
            </div>

            <div className="mt-auto pt-7">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-ink/20">
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand"
                    aria-label="Diminuer la quantité"
                  >
                    <Icon name="minus" className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.min(99, value + 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand"
                    aria-label="Augmenter la quantité"
                  >
                    <Icon name="plus" className="h-4 w-4" />
                  </button>
                </div>
                <button
                  ref={addButtonRef}
                  type="button"
                  className="btn-dark flex-1"
                  onClick={() => {
                    addItem(product, qty)
                    onClose()
                  }}
                >
                  Ajouter · {euro(product.price * qty)}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-inkSoft">
                <span className="flex items-center gap-1.5">
                  <Icon name="truck" className="h-4 w-4 text-clay" /> Expédié en 24 h
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="leaf" className="h-4 w-4 text-clay" /> 98 % naturel
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="shield" className="h-4 w-4 text-clay" /> 30 jours pour changer d'avis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
