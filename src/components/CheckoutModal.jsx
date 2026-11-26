import { useEffect, useState } from 'react'
import {
  CRYPTO_WALLETS,
  PAYOUT,
  payoutLink,
  SHOP,
} from '../config'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'
import { euro } from '../lib/format'
import { encodeOrderCode, formatClientNumber, makeClientNumber } from '../lib/code'
import { buildOrder, mailtoShare, orderToText, telegramShare, whatsappShare } from '../lib/orders'
import Icon from './Icon'
import ReserveTimer from './ReserveTimer'

const inputClass = 'field mt-1.5'

const panel = 'rounded-xl border border-ink/12 bg-ivory p-3.5'

export default function CheckoutModal({ open, onClose }) {
  const { user, openAuth } = useAuth()
  const { createOrder, orders } = useOrders()
  const {
    items,
    subtotal,
    marketTotal,
    autoOffer,
    promo,
    totalDiscount,
    paymentAmount,
    shipping,
    total,
    totalSaved,
    count,
    clear,
    removePromo,
    reservedUntil,
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
  const [deliveryMode, setDeliveryMode] = useState('pickup')
  const pickup = null
  const [manualPickup, setManualPickup] = useState({ name: '', address: '', zip: '', city: '', hours: '' })
  const [txHash, setTxHash] = useState('')
  const [confirmed, setConfirmed] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)

  const wallet = CRYPTO_WALLETS[0]
  const link = payoutLink(total)
  const orderText = confirmed ? orderToText(confirmed) : ''

  useEffect(() => {
    if (!open) {
      setConfirmed(null)
      setError(null)
      setCopied(null)
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

  const copy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /* presse-papiers indisponible */
    }
    setCopied(key)
    setTimeout(() => setCopied(null), 2200)
  }

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Renseignez votre prénom et votre nom.')
      return false
    }
    if (!form.email.trim()) {
      setError('Indiquez votre adresse e-mail : c’est par là que nous vous envoyons le suivi de commande.')
      return false
    }
    if (deliveryMode === 'pickup') {
      const chosen = pickup ?? (manualPickup.city.trim() ? manualPickup : null)
      if (!chosen) {
        setError('Indiquez la ville où vous souhaitez retirer votre colis.')
        return false
      }
    } else if (!form.address.trim() || !/^\d{4,5}$/.test(form.zip.trim()) || !form.city.trim()) {
      setError('Adresse de livraison incomplète (adresse, code postal, ville).')
      return false
    }
    setError(null)
    return true
  }

  const placeOrder = () => {
    if (!validate()) return
    const activePickup =
      deliveryMode === 'pickup'
        ? pickup ?? {
            id: 'manual',
            name: manualPickup.name.trim() || 'Point relais à confirmer',
            address: '',
            zip: manualPickup.zip.trim(),
            city: manualPickup.city.trim(),
            hours: 'Nous vous communiquons le point relais exact par e-mail',
          }
        : null

    const order = buildOrder({
      clientNumber: makeClientNumber(orders),
      items,
      totals: { subtotal, marketTotal, totalDiscount, autoOffer, shipping, total, totalSaved },
      form,
      deliveryMode,
      pickup: activePickup,
      wallet: wallet?.id ?? 'usdt',
    })
    if (txHash.trim()) {
      order.payment.txHash = txHash.trim()
      order.payment.declaredAt = new Date().toISOString()
    }
    createOrder(order)
    setConfirmed(order)
    clear()
  }

  return (
    <div className="fixed inset-0 z-[88] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={confirmed ? 'Commande confirmée' : 'Finaliser la commande'}
        className="relative z-10 max-h-[94vh] w-full max-w-4xl animate-fade-up overflow-y-auto bg-ivory shadow-soft sm:rounded-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-ivory/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-goldDeep">
              {confirmed ? 'Commande enregistrée' : 'Commande sécurisée'}
            </p>
            <h2 className="font-serif text-[22px] sm:text-2xl">
              {confirmed ? 'Commande enregistrée' : 'Finaliser ma commande'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-cream"
            aria-label="Fermer"
          >
            <Icon name="close" />
          </button>
        </header>

        {confirmed ? (
          <Confirmation
            order={confirmed}
            orderText={orderText}
            copied={copied}
            copy={copy}
            onClose={onClose}
          />
        ) : (
          <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr] [&>*]:min-w-0">
            <div className="p-5 sm:p-6">
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
                  Me connecter par e-mail
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
                <div>
                  <label htmlFor="co-email" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                    E-mail
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="pour le suivi de commande"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="co-phone" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                    Téléphone <span className="normal-case tracking-normal text-inkSoft/70">(facultatif)</span>
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="06 12 34 56 78"
                    className={inputClass}
                  />
                </div>
              </div>

              <h3 className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-inkSoft">
                2 · Où livrer ?
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: 'pickup', label: 'Point relais', icon: 'store', note: 'Gratuit dès 35 €' },
                  { id: 'home', label: 'À domicile', icon: 'pin', note: 'Colissimo 48 h' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDeliveryMode(mode.id)}
                    aria-pressed={deliveryMode === mode.id}
                    className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      deliveryMode === mode.id
                        ? 'border-goldDeep bg-gold/10'
                        : 'border-ink/15 hover:bg-cream/60'
                    }`}
                  >
                    <Icon name={mode.icon} className="mt-0.5 h-4 w-4 text-ink" />
                    <span>
                      <span className="block text-[12.5px] font-medium text-ink">{mode.label}</span>
                      <span className="block text-[10px] text-inkSoft">{mode.note}</span>
                    </span>
                  </button>
                ))}
              </div>

              {deliveryMode === 'home' ? (
                <div className="mt-3 grid gap-3">
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
                      placeholder="Code interphone, étage…"
                      className={inputClass}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-[11px] leading-relaxed text-inkSoft">
                    Indiquez la ville où vous souhaitez retirer votre colis. Nous vous communiquons
                    le point relais exact par e-mail et dans le suivi de votre commande dès
                    l’expédition.
                  </p>
                  <div className="mt-2 grid gap-3">
                    <div>
                      <label htmlFor="co-pickup-city" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                        Ville de retrait *
                      </label>
                      <input
                        id="co-pickup-city"
                        value={manualPickup.city}
                        onChange={(event) =>
                          setManualPickup({ ...manualPickup, city: event.target.value })
                        }
                        placeholder="Lyon"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="co-pickup-name" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                          Point relais souhaité (facultatif)
                        </label>
                        <input
                          id="co-pickup-name"
                          value={manualPickup.name}
                          onChange={(event) =>
                            setManualPickup({ ...manualPickup, name: event.target.value })
                          }
                          placeholder="Nom du commerce"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="co-pickup-zip" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                          Code postal (facultatif)
                        </label>
                        <input
                          id="co-pickup-zip"
                          value={manualPickup.zip}
                          onChange={(event) =>
                            setManualPickup({ ...manualPickup, zip: event.target.value })
                          }
                          inputMode="numeric"
                          placeholder="69003"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="co-notes-pickup" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                        Préférences (facultatif)
                      </label>
                      <input
                        id="co-notes-pickup"
                        value={form.notes}
                        onChange={update('notes')}
                        placeholder="Près de chez moi, ouvert le samedi…"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              <h3 className="mt-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-inkSoft">
                3 · Paiement
                <span className="badge bg-forest/10 text-[9px] text-forest">−5 % automatique</span>
              </h3>

              <div className={`mt-2 ${panel} bg-cream/50`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-goldDeep">
                    À régler
                  </p>
                  <p className="font-serif text-[26px] leading-none text-ink">{euro(total)}</p>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-inkSoft">
                  Le règlement se fait sur la page sécurisée de notre prestataire de paiement, au nom
                  de <span className="font-medium text-ink">{SHOP.name}</span>. Vous choisissez votre
                  moyen de paiement, puis vous revenez ici valider votre commande.
                </p>

                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-gold mt-3 w-full justify-center"
                  >
                    <Icon name="lock" className="h-4 w-4" /> {PAYOUT.label} · {euro(total)}
                  </a>
                ) : (
                  <div className="mt-3 rounded-xl border border-ink/15 bg-ivory p-3">
                    <p className="flex items-center gap-2 text-[12px] font-medium text-ink">
                      <Icon name="mail" className="h-4 w-4 text-goldDeep" />
                      Paiement en cours d’activation
                    </p>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-inkSoft">
                      Nous n’affichons aucune adresse de paiement sur le site : vous réglez via le lien
                      sécurisé de notre prestataire. Il est en cours de mise en place — écrivez-nous à{' '}
                      <a href={`mailto:${SHOP.email}`} className="underline">
                        {SHOP.email}
                      </a>{' '}
                      et nous vous transmettons le lien personnel de votre commande.
                    </p>
                  </div>
                )}

                <div className="mt-3">
                  <label
                    htmlFor="co-tx"
                    className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft"
                  >
                    Référence du paiement (facultatif)
                  </label>
                  <input
                    id="co-tx"
                    value={txHash}
                    onChange={(event) => setTxHash(event.target.value)}
                    placeholder="Référence ou numéro de transaction"
                    className={`${inputClass} font-mono text-[11px]`}
                  />
                  <p className="mt-1 text-[10px] leading-relaxed text-inkSoft">
                    Si votre prestataire vous a donné une référence, collez-la : elle accélère la
                    vérification et la préparation du colis.
                  </p>
                </div>
              </div>

              {error && (
                <p className="mt-3 rounded-lg bg-rose/10 px-3 py-2 text-[12px] text-rose" role="alert">
                  {error}
                </p>
              )}
            </div>

            <aside className="border-t border-ink/10 bg-cream/50 p-5 sm:p-6 md:border-l md:border-t-0">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-inkSoft">
                Récapitulatif
              </h3>
              <div className="mt-3">
                <ReserveTimer until={reservedUntil} />
              </div>
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
                    <dt>Remise crypto −5 %</dt>
                    <dd>−{euro(paymentAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-inkSoft">
                  <dt>Livraison</dt>
                  <dd>{shipping === 0 ? 'Offerte' : euro(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-2 text-[15px] font-medium">
                  <dt>Total à payer</dt>
                  <dd>{euro(total)}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-gold/15 px-2.5 py-1.5 text-[11px] font-medium text-goldDeep">
                  <dt>Économie totale</dt>
                  <dd>{euro(totalSaved)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={placeOrder}
                className="btn-gold mt-4 w-full"
              >
                <Icon name="coin" className="h-4 w-4" />
                J’ai payé · valider
              </button>
              <p className="mt-2 text-center text-[10px] leading-relaxed text-inkSoft">
                Vous validez votre commande et l’adresse de livraison. Nous vérifions la réception du
                paiement puis nous préparons le colis.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

/** Écran de confirmation : référence, récap, envoi au vendeur, suivi. */
function Confirmation({ order, orderText, copied, copy, onClose }) {
  return (
    <div className="p-5 sm:p-7">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/15 text-sage">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <h3 className="mt-3 font-serif text-[26px]">C’est enregistré, {order.delivery.firstName} !</h3>
        <p className="mx-auto mt-1.5 max-w-md text-[12.5px] leading-relaxed text-inkSoft">
          Votre commande <strong className="text-ink">{order.reference}</strong> est créée. Dernière
          étape : envoyez {order.payment.amount} sur le réseau {order.payment.network}, puis
          transmettez le récapitulatif ci-dessous au vendeur.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-goldDeep/40 bg-gold/10 p-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-goldDeep">
          Votre numéro cliente
        </p>
        <p className="mt-1 font-serif text-[38px] leading-none tracking-[0.08em] text-ink">
          {formatClientNumber(order.clientNumber)}
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-relaxed text-inkSoft">
          Gardez-le : c’est lui que vous donnez à la boutique sur Discord ou Telegram. Avec le code
          ci-dessous, elle ouvre votre commande même sans avoir votre appareil.
        </p>
        <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => copy(order.clientNumber, 'num')}
            className="btn-outline flex-1 text-[10px]"
          >
            <Icon name={copied === 'num' ? 'check' : 'copy'} className="h-3.5 w-3.5" />
            {copied === 'num' ? 'Numéro copié' : 'Copier mon numéro'}
          </button>
          <button
            type="button"
            onClick={() => copy(encodeOrderCode(order), 'code')}
            className="btn-dark flex-1 text-[10px]"
          >
            <Icon name={copied === 'code' ? 'check' : 'copy'} className="h-3.5 w-3.5" />
            {copied === 'code' ? 'Code copié' : 'Copier mon code de commande'}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className={panel}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-goldDeep">À envoyer</p>
          <p className="mt-1 font-serif text-[22px] leading-none">{order.payment.amount}</p>
          <p className="mt-1 text-[11px] text-inkSoft">
            {euro(order.amounts.total)} · {order.payment.network}
          </p>
          <code className="mt-2 block break-all rounded-lg bg-cream px-2.5 py-2 font-mono text-[10px] leading-relaxed">
            {order.payment.address}
          </code>
          <button
            type="button"
            onClick={() => copy(order.payment.address, 'addr2')}
            className="btn-outline mt-2 w-full text-[10px]"
          >
            <Icon name={copied === 'addr2' ? 'check' : 'copy'} className="h-3.5 w-3.5" />
            {copied === 'addr2' ? 'Adresse copiée' : 'Copier l’adresse'}
          </button>
        </div>

        <div className={panel}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-goldDeep">Livraison</p>
          <p className="mt-1 text-[12.5px] font-medium text-ink">
            {order.delivery.mode === 'pickup' ? 'Point relais' : 'À domicile'}
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-inkSoft">
            {order.delivery.firstName} {order.delivery.lastName}
            <br />
            {order.delivery.pickup ? order.delivery.pickup.name : order.delivery.address}
            <br />
            {order.delivery.pickup?.address ? `${order.delivery.pickup.address} · ` : ''}
            {order.delivery.zip} {order.delivery.city}, {order.delivery.country}
            {order.delivery.pickup ? ` · ${order.delivery.pickup.hours}` : ''}
          </p>
          <p className="mt-2 text-[10.5px] text-inkSoft">
            {order.delivery.email || '—'} · {order.delivery.phone || '—'}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-forest/25 bg-forest/5 p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-forest">
          Envoyez ce message au vendeur
        </p>
        <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-ivory px-3 py-2.5 font-sans text-[10.5px] leading-relaxed text-inkSoft">
          {orderText}
        </pre>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button type="button" onClick={() => copy(orderText, 'msg')} className="btn-outline text-[10px]">
            <Icon name={copied === 'msg' ? 'check' : 'copy'} className="h-3.5 w-3.5" />
            {copied === 'msg' ? 'Copié' : 'Copier'}
          </button>
          <a
            href={telegramShare(orderText)}
            target="_blank"
            rel="noreferrer"
            className="btn-outline text-[10px]"
          >
            <Icon name="send" className="h-3.5 w-3.5" />
            Telegram
          </a>
          <a
            href={whatsappShare(orderText)}
            target="_blank"
            rel="noreferrer"
            className="btn-outline text-[10px]"
          >
            <Icon name="chat" className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <a href={mailtoShare(order, orderText)} className="btn-outline text-[10px]">
            <Icon name="mail" className="h-3.5 w-3.5" />
            E-mail
          </a>
        </div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-inkSoft">
          Astuce : collez ce message dans votre conversation Telegram ou Discord avec le vendeur — il
          contient l’adresse, le point relais, le montant et le hash de paiement.
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a href={`#suivi/${order.reference}`} onClick={onClose} className="btn-dark flex-1">
          <Icon name="box" className="h-4 w-4" />
          Suivre ma commande
        </a>
        <button type="button" onClick={onClose} className="btn-outline flex-1">
          Continuer mes achats
        </button>
      </div>

      <p className="mt-3 text-center text-[10px] leading-relaxed text-inkSoft">
        Conservez votre référence <strong className="text-ink">{order.reference}</strong> : elle vous
        donne accès au suivi et à la messagerie avec le vendeur.
      </p>
    </div>
  )
}
