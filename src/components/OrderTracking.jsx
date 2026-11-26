import { useEffect, useMemo, useState } from 'react'
import { useOrders } from '../hooks/useOrders'
import { euro } from '../lib/format'
import { ORDER_STATUSES, statusById } from '../lib/orders'
import Icon from './Icon'

const TRACK = ['paid', 'preparing', 'shipped', 'relay_arrived', 'delivered']

export default function OrderTracking({ reference, onBack }) {
  const { orders, sendMessage, markRead } = useOrders()
  const [draft, setDraft] = useState('')
  const order = useMemo(
    () => orders.find((item) => item.reference === reference) ?? null,
    [orders, reference],
  )

  useEffect(() => {
    if (order) markRead(order.reference)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  if (!reference) {
    return (
      <div className="container-x py-14">
        <div className="mx-auto max-w-md">
          <p className="eyebrow">Suivi de commande</p>
          <h1 className="mt-1.5 font-serif text-3xl">Où est mon colis ?</h1>
          <p className="mt-2 text-[12.5px] leading-relaxed text-inkSoft">
            Saisissez la référence reçue à la commande (format BP-261126-1242).
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const value = new FormData(event.target).get('ref')?.toString().trim()
              if (value) window.location.hash = `suivi/${value}`
            }}
            className="mt-4 flex gap-2"
          >
            <input name="ref" placeholder="BP-…" className="field flex-1" />
            <button type="submit" className="btn-dark text-[10.5px]">
              <Icon name="search" className="h-3.5 w-3.5" />
              Voir
            </button>
          </form>

          {orders.length > 0 && (
            <div className="mt-5 rounded-2xl border border-ink/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-inkSoft">
                Commandes passées sur cet appareil
              </p>
              <ul className="mt-2 divide-y divide-ink/10">
                {orders.slice(0, 6).map((item) => (
                  <li key={item.reference}>
                    <a
                      href={`#suivi/${item.reference}`}
                      className="flex items-center justify-between py-2 text-[12px] hover:text-goldDeep"
                    >
                      <span className="font-mono">{item.reference}</span>
                      <span className="text-inkSoft">{euro(item.amounts.total)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button type="button" onClick={onBack} className="btn-outline mt-4 w-full text-[10.5px]">
            Retour à la boutique
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container-x py-16 text-center">
        <Icon name="box" className="mx-auto h-8 w-8 text-inkSoft" />
        <h1 className="mt-3 font-serif text-3xl">Commande introuvable</h1>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-inkSoft">
          La référence <strong className="text-ink">{reference}</strong> n’existe pas sur cet
          appareil. Les commandes sont stockées dans le navigateur où elles ont été passées.
        </p>
        <button type="button" onClick={onBack} className="btn-dark mt-5">
          Retour à la boutique
        </button>
      </div>
    )
  }

  const status = statusById(order.status)
  const stepIndex = TRACK.indexOf(order.status)
  const d = order.delivery
  const pickup = d.pickup

  const send = () => {
    if (!draft.trim()) return
    sendMessage(order.reference, { from: 'client', body: draft })
    setDraft('')
  }

  return (
    <div className="container-x py-10 lg:py-14">
      <button type="button" onClick={onBack} className="text-[11px] uppercase tracking-[0.14em] text-inkSoft hover:text-ink">
        ← Retour à la boutique
      </button>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-4">
        <div>
          <p className="eyebrow">Suivi de commande</p>
          <h1 className="mt-1.5 font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight">
            {order.reference}
          </h1>
          <p className="mt-1 text-[12px] text-inkSoft">
            Passée le{' '}
            {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(
              new Date(order.createdAt),
            )}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`badge px-3 py-1 text-[10.5px] ${
              status.tone === 'rose'
                ? 'bg-rose/15 text-rose'
                : status.tone === 'sage'
                  ? 'bg-sage/15 text-sage'
                  : 'bg-gold/15 text-goldDeep'
            }`}
          >
            {status.label}
          </span>
          <p className="mt-1.5 font-serif text-2xl">{euro(order.amounts.total)}</p>
          <p className="text-[10.5px] text-inkSoft">{order.payment.amount}</p>
        </div>
      </div>

      {order.status === 'cancelled' ? (
        <p className="mt-5 rounded-xl bg-rose/10 px-4 py-3 text-[12.5px] text-rose">
          Cette commande a été annulée. Le remboursement en {order.payment.asset} est traité sous 24 h
          sur l’adresse d’envoi.
        </p>
      ) : (
        <ol className="mt-6 grid gap-2 sm:grid-cols-5">
          {TRACK.map((stepId, index) => {
            const step = ORDER_STATUSES.find((item) => item.id === stepId)
            const done = index <= stepIndex
            return (
              <li key={stepId} className="flex items-center gap-2 sm:flex-col sm:items-start">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    done ? 'bg-forest text-cream' : 'border border-ink/20 text-inkSoft'
                  }`}
                >
                  {done ? <Icon name="check" className="h-3 w-3" /> : index + 1}
                </span>
                <span className={`text-[10.5px] ${done ? 'font-medium text-ink' : 'text-inkSoft'}`}>
                  {step?.short}
                </span>
              </li>
            )
          })}
        </ol>
      )}

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-ink/10 bg-cream/40 p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-inkSoft">
              Paiement
            </h2>
            <p className="mt-2 font-serif text-[20px]">{order.payment.amount}</p>
            <p className="text-[11.5px] text-inkSoft">
              {euro(order.amounts.total)} · {order.payment.network}
            </p>
            <code className="mt-2 block break-all rounded-lg bg-ivory px-2.5 py-2 font-mono text-[10px] leading-relaxed">
              {order.payment.address}
            </code>
            {order.payment.txHash ? (
              <p className="mt-2 break-all font-mono text-[9.5px] text-inkSoft">
                Tx : {order.payment.txHash}
              </p>
            ) : (
              <p className="mt-2 text-[11px] text-goldDeep">
                Aucun hash transmis — envoyez-le dans la messagerie ci-contre pour accélérer la
                vérification.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-ink/10 p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-inkSoft">
              Livraison
            </h2>
            <p className="mt-2 text-[13px] font-medium text-ink">
              {d.mode === 'pickup' ? 'Point relais' : 'À domicile'}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-inkSoft">
              {d.firstName} {d.lastName}
              <br />
              {pickup ? pickup.name : d.address}
              <br />
              {pickup ? `${pickup.address} · ` : ''}
              {d.zip} {d.city}, {d.country}
              {pickup ? ` · ${pickup.hours}` : ''}
            </p>
            {d.notes && <p className="mt-2 text-[11.5px] italic text-inkSoft">« {d.notes} »</p>}
          </div>

          <div className="rounded-2xl border border-ink/10 p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-inkSoft">
              Articles
            </h2>
            <ul className="mt-2 divide-y divide-ink/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2">
                  <img src={item.image} alt="" className="h-11 w-9 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[15px]">{item.name}</p>
                    <p className="text-[10.5px] uppercase tracking-[0.08em] text-inkSoft">
                      {item.brand} · × {item.qty}
                    </p>
                  </div>
                  <p className="text-[12px]">{euro(item.line)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-2 space-y-1 border-t border-ink/10 pt-2 text-[12px]">
              <div className="flex justify-between text-inkSoft">
                <dt>Livraison</dt>
                <dd>{order.amounts.shipping === 0 ? 'Offerte' : euro(order.amounts.shipping)}</dd>
              </div>
              <div className="flex justify-between font-medium">
                <dt>Total</dt>
                <dd>{euro(order.amounts.total)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-ink/10 bg-ivory">
          <div className="border-b border-ink/10 px-4 py-3">
            <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-inkSoft">
              <Icon name="chat" className="h-3.5 w-3.5 text-goldDeep" />
              Messages avec la boutique
            </h2>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto p-4" style={{ maxHeight: 380 }}>
            {(order.messages ?? []).length === 0 && (
              <p className="text-[12px] leading-relaxed text-inkSoft">
                Aucun message pour l’instant. Posez votre question (relais, délai, adresse…) : la
                boutique répond ici.
              </p>
            )}
            {(order.messages ?? []).map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                  message.from === 'client'
                    ? 'ml-auto bg-forest text-cream'
                    : 'bg-cream text-ink'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.body}</p>
                <p
                  className={`mt-1 text-[9px] ${
                    message.from === 'client' ? 'text-cream/60' : 'text-inkSoft'
                  }`}
                >
                  {message.from === 'client' ? 'Vous' : 'Beauté Paris'} ·{' '}
                  {new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short' }).format(new Date(message.at))}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10 p-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={2}
              placeholder="Écrire à la boutique…"
              className="field resize-none"
            />
            <button type="button" onClick={send} className="btn-dark mt-2 w-full text-[11px]">
              <Icon name="send" className="h-3.5 w-3.5" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
