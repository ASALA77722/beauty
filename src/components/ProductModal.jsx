import { useEffect, useRef, useState } from 'react'
import { FLASH_OFFER, brandOf, finalPrice } from '../data/shop'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { discountPercent, euro } from '../lib/format'
import Icon from './Icon'
import Stars from './Stars'
import StockMeter from './StockMeter'

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const { user, openAuth } = useAuth()
  const [qty, setQty] = useState(1)
  const [showInci, setShowInci] = useState(false)
  const [showUsage, setShowUsage] = useState(false)
  const addButtonRef = useRef(null)

  useEffect(() => {
    if (!product) return
    setQty(1)
    setShowInci(false)
    setShowUsage(false)
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

  const brand = brandOf(product)
  const price = finalPrice(product)
  const off = discountPercent(product.marketPrice, price)
  const saving = Math.round((product.marketPrice - price) * 100) / 100

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink/55" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${brand.name} ${product.name}`}
        className="relative z-10 max-h-[94vh] w-full max-w-4xl animate-fade-up overflow-y-auto bg-ivory shadow-soft sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-sm transition-colors hover:bg-cream"
          aria-label="Fermer la fiche produit"
        >
          <Icon name="close" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative bg-cream">
            <img src={product.image} alt={product.name} className="h-72 w-full object-cover md:h-full" />
            <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
              {off > 0 && <span className="badge bg-rose text-ivory">−{off} %</span>}
              <span className="badge bg-ivory/95 text-ink">{product.volume}</span>
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-goldDeep">{brand.name}</p>
            <h2 className="mt-1.5 font-serif text-[30px] leading-tight">{product.name}</h2>
            <p className="mt-0.5 text-[12px] text-inkSoft">
              {product.line} · {product.category}
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <Stars value={product.rating} showValue count={product.reviews} />
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-serif text-4xl text-ink">{euro(price)}</span>
              <span className="market-price text-[13px]">{euro(product.marketPrice)}</span>
              <span className="badge bg-sage/15 text-sage">Économisez {euro(saving)}</span>
            </div>
            <p className="mt-1 text-[11px] text-inkSoft">
              Prix magasin {euro(product.marketPrice)} · {FLASH_OFFER.label} −{FLASH_OFFER.percent} % inclus
              · Paiement en 3× = {euro(Math.round((price / 3) * 100) / 100)}/mois
            </p>

            <p className="mt-4 text-[13.5px] leading-relaxed text-inkSoft">{product.description}</p>

            <ul className="mt-4 space-y-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-[12.5px] text-ink">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-goldDeep" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl bg-cream/70 px-3.5 py-2.5">
              <StockMeter product={product} compact />
              <p className="mt-1.5 text-[10.5px] text-inkSoft">
                Stock réel, mis à jour en continu. Expédition sous 24 h ouvrées.
              </p>
            </div>

            <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              <div>
                <button
                  type="button"
                  onClick={() => setShowUsage((value) => !value)}
                  aria-expanded={showUsage}
                  className="flex w-full items-center justify-between py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-inkSoft transition-colors hover:text-ink"
                >
                  Conseils d'utilisation
                  <Icon
                    name="chevron"
                    className={`h-4 w-4 transition-transform ${showUsage ? 'rotate-180 text-goldDeep' : ''}`}
                  />
                </button>
                {showUsage && (
                  <p className="animate-fade-in pb-3 text-[12px] leading-relaxed text-inkSoft">
                    {product.usage}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowInci((value) => !value)}
                  aria-expanded={showInci}
                  className="flex w-full items-center justify-between py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-inkSoft transition-colors hover:text-ink"
                >
                  Composition complète (INCI)
                  <Icon
                    name="chevron"
                    className={`h-4 w-4 transition-transform ${showInci ? 'rotate-180 text-goldDeep' : ''}`}
                  />
                </button>
                {showInci && (
                  <p className="animate-fade-in pb-3 text-[11px] leading-relaxed text-inkSoft">
                    {product.inci}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-auto pt-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-ink/20">
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-cream"
                    aria-label="Diminuer la quantité"
                  >
                    <Icon name="minus" className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.min(99, value + 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-cream"
                    aria-label="Augmenter la quantité"
                  >
                    <Icon name="plus" className="h-4 w-4" />
                  </button>
                </div>
                <button
                  ref={addButtonRef}
                  type="button"
                  className="btn-gold flex-1"
                  onClick={() => {
                    addItem(product, qty)
                    onClose()
                  }}
                >
                  Ajouter · {euro(Math.round(price * qty * 100) / 100)}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10.5px] text-inkSoft">
                <span className="flex items-center gap-1.5">
                  <Icon name="shield" className="h-3.5 w-3.5 text-gold" /> Authenticité garantie
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="truck" className="h-3.5 w-3.5 text-gold" /> Expédié en 24 h
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="lock" className="h-3.5 w-3.5 text-gold" /> Paiement sécurisé
                </span>
              </div>

              {!user && (
                <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-[11.5px] text-inkSoft">
                  <button
                    type="button"
                    onClick={() => openAuth()}
                    className="font-medium text-goldDeep underline underline-offset-2"
                  >
                    Connectez-vous
                  </button>{' '}
                  avec votre e-mail ou téléphone pour finaliser la commande.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
