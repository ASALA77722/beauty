import { useCart } from '../hooks/useCart'
import { euro } from '../lib/format'
import Icon from './Icon'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    shipping,
    total,
    remainingForFreeShipping,
    setQty,
    removeItem,
    count,
  } = useCart()

  if (!isOpen) return null

  const progress = Math.min(100, Math.round(((60 - remainingForFreeShipping) / 60) * 100))

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Panier">
      <div
        className="absolute inset-0 bg-ink/45 animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-soft animate-slide-in">
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <h2 className="font-serif text-2xl">Votre panier</h2>
            <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-inkSoft">
              {count} article{count > 1 ? 's' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-sand"
            aria-label="Fermer le panier"
          >
            <Icon name="close" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand">
              <Icon name="bag" className="h-8 w-8 text-clay" />
            </span>
            <div>
              <p className="font-serif text-2xl">Votre panier est vide</p>
              <p className="mt-2 text-sm leading-relaxed text-inkSoft">
                Nos soins vous attendent. Commencez par le Sérum Éclat, notre best-seller.
              </p>
            </div>
            <a href="#boutique" onClick={closeCart} className="btn-dark mt-1">
              Voir la boutique
            </a>
          </div>
        ) : (
          <>
            <div className="border-b border-ink/10 bg-sand/50 px-6 py-4">
              {remainingForFreeShipping > 0 ? (
                <p className="text-xs text-inkSoft">
                  Plus que <strong className="text-ink">{euro(remainingForFreeShipping)}</strong> pour
                  la livraison offerte
                </p>
              ) : (
                <p className="text-xs font-medium text-sage">✦ Livraison offerte débloquée</p>
              )}
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-clay transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto px-6">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 border-b border-ink/10 py-5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-20 shrink-0 rounded-sm object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg leading-tight">{product.name}</p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-inkSoft">
                          {product.volume}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-inkSoft transition-colors hover:text-clay"
                        aria-label={`Retirer ${product.name} du panier`}
                      >
                        <Icon name="close" className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-ink/15">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-sand"
                          aria-label={`Diminuer la quantité de ${product.name}`}
                        >
                          <Icon name="minus" className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-sand"
                          aria-label={`Augmenter la quantité de ${product.name}`}
                        >
                          <Icon name="plus" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-medium">{euro(product.price * qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-ink/10 px-6 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-inkSoft">
                  <dt>Sous-total</dt>
                  <dd>{euro(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-inkSoft">
                  <dt>Livraison</dt>
                  <dd>{shipping === 0 ? 'Offerte' : euro(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-medium">
                  <dt>Total</dt>
                  <dd>{euro(total)}</dd>
                </div>
              </dl>
              <button type="button" className="btn-dark mt-4 w-full">
                Passer commande
                <Icon name="arrow" className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-[11px] text-inkSoft">
                Paiement sécurisé · Retours gratuits sous 30 jours
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
