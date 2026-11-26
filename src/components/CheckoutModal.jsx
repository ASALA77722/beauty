import { useEffect, useState } from 'react'
import { PAYMENT_OFFERS } from '../data/shop'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { ORDERS_KEY, euro, readJson, writeJson } from '../lib/format'
import Icon from './Icon'

const inputClass = 'field mt-1.5'

export default function CheckoutModal({ open, onClose }) {
  const { user, openAuth } = useAuth()
  const {
    items,
    subtotal,
    marketTotal,
    autoOffer,
    promo,
    totalDiscount,
    paymentAmount,
    paymentId,
    setPaymentId,
    payment,
    shipping,
    total,
    totalSaved,
    count,
    clear,
    appliedCode,
    removePromo,
  } = useCart()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    country: 'France',
    notes: '',
  })
  const [confirmed, setConfirmed] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) {
      setConfirmed(null)
      setError(null)
      return
    }
    if (user) {
      setForm((current) => ({
        ...current,
        firstName: user.firstName || current.firstName,
        lastName: user.lastName || current.lastName,
        email: user.email || (user.channel === 'email' ? user.identifier : current.email),
        phone: user.phone || (user.channel === 'phone' ? user.identifier : current.phone),
      }))
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, user])

  if (!open) return null

  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })

  const validate = () => {
    if (!user) {
      openAuth()
      return false
    }
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Renseignez votre prénom et votre nom.')
      return false
    }
    if (!form.address.trim() || !/^\d{4,5}$/.test(form.zip.trim()) || !form.city.trim()) {
      setError('Adresse de livraison incomplète (adresse, code postal, ville).')
      return false
    }
    setError(null)
    return true
  }

  const placeOrder = () => {
    if (!validate()) return
    const reference = `BP-${Date.now().toString().slice(-8)}`
    const order = {
      reference,
      date: new Date().toISOString(),
      items: items.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        brand: product.line,
        qty,
      })),
      total,
      totalSaved,
      payment: payment?.label ?? 'Carte bancaire',
      customer: { ...form, identifier: user?.identifier },
    }
    const orders = readJson(ORDERS_KEY, [])
    writeJson(ORDERS_KEY, [order, ...(Array.isArray(orders) ? orders : [])])
    setConfirmed(order)
    clear()
  }

  return (
    <div className="fixed inset-0 z-[88] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Finaliser la commande"
        className="relative z-10 max-h-[94vh] w-full max-w-3xl animate-fade-up overflow-y-auto bg-ivory shadow-soft sm:rounded-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-ivory/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-goldDeep">Commande sécurisée</p>
            <h2 className="font-serif text-2xl">
              {confirmed ? 'Merci pour votre commande' : 'Finaliser ma commande'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-cream"
            aria-label="Fermer"
          >
            <Icon name="close" />
          </button>
        </header>

        {confirmed ? (
          <div className="p-7 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/15 text-sage">
              <Icon name="check" className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-serif text-3xl">C'est noté, {confirmed.customer.firstName} !</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-inkSoft">
              Votre commande <strong className="text-ink">{confirmed.reference}</strong> est confirmée.
              Un e-mail et un SMS de suivi vous seront envoyés. Vous avez économisé{' '}
              <strong className="text-goldDeep">{euro(confirmed.totalSaved)}</strong> au total.
            </p>
            <dl className="mx-auto mt-6 max-w-sm space-y-1.5 border-t border-ink/10 pt-4 text-left text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-inkSoft">Total payé</dt>
                <dd className="font-medium">{euro(confirmed.total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-inkSoft">Moyen de paiement</dt>
                <dd className="font-medium">{confirmed.payment}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-inkSoft">Livraison</dt>
                <dd className="text-right font-medium">
                  {confirmed.customer.address}, {confirmed.customer.zip} {confirmed.customer.city}
                </dd>
              </div>
            </dl>
            <button type="button" onClick={onClose} className="btn-dark mt-6">
              Continuer mes achats
            </button>
          </div>
        ) : (
          <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-inkSoft">
                1 · Coordonnées
              </h3>
              {user ? (
                <p className="mt-2 flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-[12px] text-ink">
                  <Icon name="check" className="h-3.5 w-3.5 text-sage" />
                  Connectée avec <strong className="font-medium">{user.identifier}</strong>
                </p>
              ) : (
                <button type="button" onClick={() => openAuth()} className="btn-outline mt-2 w-full">
                  Me connecter (e-mail ou téléphone)
                </button>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-first" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                    Prénom *
                  </label>
                  <input id="co-first" value={form.firstName} onChange={update('firstName')} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="co-last" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                    Nom *
                  </label>
                  <input id="co-last" value={form.lastName} onChange={update('lastName')} className={inputClass} />
                </div>
              </div>

              <h3 className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-inkSoft">
                2 · Livraison
              </h3>
              <div className="mt-2 grid gap-3">
                <div>
                  <label htmlFor="co-address" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                    Adresse *
                  </label>
                  <input
                    id="co-address"
                    value={form.address}
                    onChange={update('address')}
                    placeholder="12 rue des Fleurs"
                    className={inputClass}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-[0.4fr_1fr]">
                  <div>
                    <label htmlFor="co-zip" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                      Code postal *
                    </label>
                    <input id="co-zip" value={form.zip} onChange={update('zip')} inputMode="numeric" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="co-city" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                      Ville *
                    </label>
                    <input id="co-city" value={form.city} onChange={update('city')} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="co-notes" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                    Instructions (optionnel)
                  </label>
                  <input
                    id="co-notes"
                    value={form.notes}
                    onChange={update('notes')}
                    placeholder="Code interphone, point relais…"
                    className={inputClass}
                  />
                </div>
              </div>

              <h3 className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-inkSoft">
                3 · Paiement
              </h3>
              <div className="mt-2 space-y-2">
                {PAYMENT_OFFERS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
                      paymentId === option.id
                        ? 'border-goldDeep bg-gold/10'
                        : 'border-ink/15 hover:bg-cream/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={paymentId === option.id}
                      onChange={() => setPaymentId(option.id)}
                      className="h-4 w-4 accent-goldDeep"
                    />
                    <Icon name={option.icon} className="h-4 w-4 text-ink" />
                    <span className="flex-1">
                      <span className="block text-[12.5px] font-medium text-ink">{option.label}</span>
                      <span className="block text-[10.5px] text-inkSoft">{option.note}</span>
                    </span>
                    {option.discount > 0 && (
                      <span className="badge bg-sage/15 text-sage">−{option.discount} %</span>
                    )}
                  </label>
                ))}
              </div>

              {error && (
                <p className="mt-3 rounded-lg bg-rose/10 px-3 py-2 text-[12px] text-rose" role="alert">
                  {error}
                </p>
              )}
            </div>

            <aside className="border-t border-ink/10 bg-cream/50 p-6 md:border-l md:border-t-0">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-inkSoft">
                Récapitulatif
              </h3>
              <ul className="mt-3 space-y-3">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="flex items-center gap-2.5">
                    <img src={product.image} alt="" className="h-12 w-10 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-[15px]">{product.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-inkSoft">× {qty}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-1.5 border-t border-ink/10 pt-3 text-[12px]">
                <div className="flex justify-between text-inkSoft">
                  <dt>Prix magasin</dt>
                  <dd className="line-through">{euro(marketTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-inkSoft">Sous-total ({count} art.)</dt>
                  <dd>{euro(subtotal)}</dd>
                </div>
                {autoOffer && (
                  <div className="flex justify-between text-sage">
                    <dt>{autoOffer.label}</dt>
                    <dd>−{euro(autoOffer.amount)}</dd>
                  </div>
                )}
                {promo && (
                  <div className="flex items-center justify-between text-sage">
                    <dt className="flex items-center gap-1">
                      {promo.code}
                      <button type="button" onClick={removePromo} aria-label="Retirer le code">
                        <Icon name="close" className="h-3 w-3 text-inkSoft" />
                      </button>
                    </dt>
                    <dd>{promo.amount ? `−${euro(promo.amount)}` : 'Livraison offerte'}</dd>
                  </div>
                )}
                {paymentAmount > 0 && (
                  <div className="flex justify-between text-sage">
                    <dt>Remise {paymentLabel}</dt>
                    <dd>−{euro(paymentAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-inkSoft">
                  <dt>Livraison</dt>
                  <dd>{shipping === 0 ? 'Offerte' : euro(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-2 text-[15px] font-medium">
                  <dt>Total</dt>
                  <dd>{euro(total)}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-gold/15 px-2.5 py-1.5 text-[11px] font-medium text-goldDeep">
                  <dt>Économie totale</dt>
                  <dd>{euro(totalSaved)}</dd>
                </div>
              </dl>

              <button type="button" onClick={placeOrder} className="btn-gold mt-4 w-full">
                <Icon name="lock" className="h-4 w-4" />
                Payer {euro(total)}
              </button>
              <p className="mt-2 text-center text-[10px] leading-relaxed text-inkSoft">
                En validant, vous acceptez nos CGV. Démonstration : aucun paiement réel n'est
                effectué.
              </p>
              {appliedCode && <p className="sr-only">Code {appliedCode} pris en compte</p>}
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
