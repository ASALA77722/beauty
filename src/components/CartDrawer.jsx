import { finalPrice } from '../data/shop'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { FREE_SHIPPING_THRESHOLD, euro } from '../lib/format'
import Icon from './Icon'
import ReserveTimer from './ReserveTimer'

export default function CartDrawer({ onCheckout }) {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    marketTotal,
    autoOffer,
    promo,
    promoError,
    totalDiscount,
    paymentAmount,
    paymentLabel,
    shipping,
    shippingFree,
    total,
    totalSaved,
    count,
    setQty,
    removeItem,
    promoInput,
    setPromoInput,
    appliedCode,
    applyPromo,
    removePromo,
    reservedUntil,
  } = useCart()
  const { user, openAuth } = useAuth()

  if (!isOpen) return null

  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Panier">
      <div className="absolute inset-0 animate-fade-in bg-ink/50" onClick={closeCart} aria-hidden="true" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-soft animate-slide-in">
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <h2 className="font-serif text-2xl">Votre panier</h2>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-inkSoft">
              {count} article{count > 1 ? 's' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-cream"
            aria-label="Fermer le panier"
          >
            <Icon name="close" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
              <Icon name="bag" className="h-8 w-8 text-goldDeep" />
            </span>
            <div>
              <p className="font-serif text-2xl">Votre panier est vide</p>
              <p className="mt-2 text-sm leading-relaxed text-inkSoft">
                Commencez par le Baume Intégral Jeanne Piaubert, notre meilleure affaire du moment.
              </p>
            </div>
            <a href="#boutique" onClick={closeCart} className="btn-gold">
              Voir la boutique
            </a>
          </div>
        ) : (
          <>
            <div className="border-b border-ink/10 bg-cream/60 px-6 py-3.5">
              {shippingFree ? (
                <p className="text-[11.5px] font-medium text-sage">✦ Livraison offerte débloquée</p>
              ) : (
                <p className="text-[11.5px] text-inkSoft">
                  Plus que{' '}
                  <strong className="text-ink">{euro(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> pour la livraison
                  offerte
                </p>
              )}
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-goldDeep transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {autoOffer && (
                <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-goldDeep">
                  <Icon name="ticket" className="h-3.5 w-3.5" />
                  {autoOffer.label} appliqué : −{euro(autoOffer.amount)}
                </p>
              )}
              {!autoOffer && (
                <p className="mt-2.5 text-[11px] text-inkSoft">
                  Ajoutez un 2ᵉ produit → −10 %, un 3ᵉ → −15 % sur le total.
                </p>
              )}
              <div className="mt-2.5">
                <ReserveTimer until={reservedUntil} />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto px-6">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 border-b border-ink/10 py-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-20 shrink-0 rounded-sm object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[9.5px] uppercase tracking-[0.14em] text-goldDeep">
                          {product.line}
                        </p>
                        <p className="font-serif text-[17px] leading-tight">{product.name}</p>
                        <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.1em] text-inkSoft">
                          {product.volume}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-inkSoft transition-colors hover:text-rose"
                        aria-label={`Retirer ${product.name} du panier`}
                      >
                        <Icon name="close" className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2.5">
                      <div className="flex items-center rounded-full border border-ink/15">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-cream"
                          aria-label={`Diminuer la quantité de ${product.name}`}
                        >
                          <Icon name="minus" className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-cream"
                          aria-label={`Augmenter la quantité de ${product.name}`}
                        >
                          <Icon name="plus" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {euro(Math.round(finalPrice(product) * qty * 100) / 100)}
                        </p>
                        <p className="market-price">{euro(product.marketPrice * qty)}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-ink/10 px-6 py-4">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  applyPromo()
                }}
                className="flex gap-2"
              >
                <label htmlFor="promo-input" className="sr-only">
                  Code promotionnel
                </label>
                <input
                  id="promo-input"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                  placeholder="CODE PROMO"
                  className="field py-2 text-[12px] tracking-[0.1em]"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl border border-ink/20 px-4 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors hover:bg-ink hover:text-ivory"
                >
                  Appliquer
                </button>
              </form>
              {promoError && <p className="mt-1.5 text-[11px] text-rose">{promoError}</p>}
              {promo && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-sage/10 px-3 py-1.5">
                  <p className="text-[11px] text-sage">
                    <strong>{promo.code}</strong> appliqué
                  </p>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-[10px] uppercase tracking-[0.1em] text-inkSoft hover:text-rose"
                  >
                    Retirer
                  </button>
                </div>
              )}

              <dl className="mt-3 space-y-1.5 text-[12.5px]">
                <div className="flex justify-between text-inkSoft">
                  <dt>Prix magasin</dt>
                  <dd className="line-through">{euro(marketTotal)}</dd>
                </div>
                <div className="flex justify-between text-ink">
                  <dt>Prix Beauté Paris</dt>
                  <dd>{euro(subtotal)}</dd>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sage">
                    <dt>Remises{appliedCode ? ` (${appliedCode})` : ''}</dt>
                    <dd>−{euro(totalDiscount)}</dd>
                  </div>
                )}
                {paymentAmount > 0 && (
                  <div className="flex justify-between text-sage">
                    <dt>{paymentLabel} (−5 %)</dt>
                    <dd>−{euro(paymentAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-inkSoft">
                  <dt>Livraison</dt>
                  <dd>{shipping === 0 ? 'Offerte' : euro(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-medium">
                  <dt>Total</dt>
                  <dd>{euro(total)}</dd>
                </div>
                <div className="flex items-baseline justify-between rounded-lg bg-rose/10 px-3 py-2">
                  <dt className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-rose">
                    Vous économisez
                  </dt>
                  <dd className="text-[15px] font-semibold text-rose">{euro(totalSaved)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    openAuth(() => onCheckout())
                    return
                  }
                  onCheckout()
                }}
                className="btn-gold mt-3 w-full"
              >
                {user ? 'Passer commande' : 'Se connecter et commander'}
                <Icon name="arrow" className="h-4 w-4" />
              </button>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] text-inkSoft">
                <Icon name="lock" className="h-3.5 w-3.5" /> Paiement sécurisé · Retours 30 jours
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
