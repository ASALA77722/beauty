import { useEffect, useMemo, useState } from 'react'
import { useOrders } from '../hooks/useOrders'
import { decodeOrderCode, extractOrderCode, formatClientNumber, isOrderCode } from '../lib/code'
import { euro } from '../lib/format'
import {
  ORDER_STATUSES,
  deliveryLabel,
  fillTemplate,
  isSellerUnlocked,
  lockSeller,
  mailtoShare,
  orderToText,
  smsShare,
  statusById,
  telegramShare,
  unlockSeller,
  whatsappShare,
} from '../lib/orders'
import Icon from './Icon'

const fmt = (iso) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso))

const toneClass = (tone) =>
  tone === 'rose'
    ? 'bg-rose/15 text-rose'
    : tone === 'sage'
      ? 'bg-sage/15 text-sage'
      : 'bg-gold/15 text-goldDeep'

export default function SellerPage({ onBack }) {
  const [unlocked, setUnlocked] = useState(() => isSellerUnlocked())
  const [key, setKey] = useState('')
  const [error, setError] = useState(null)

  if (!unlocked) {
    return (
      <div className="container-x flex min-h-[70vh] items-center justify-center py-14">
        <div className="w-full max-w-sm rounded-2xl border border-ink/10 bg-ivory p-6 shadow-card">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
            <Icon name="key" className="h-5 w-5" />
          </span>
          <h1 className="mt-3 font-serif text-2xl">Espace vendeur</h1>
          <p className="mt-1 text-[12px] leading-relaxed text-inkSoft">
            Commandes, adresses de livraison, points relais et messages privés. Accès réservé.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (unlockSeller(key)) {
                setUnlocked(true)
                setError(null)
              } else setError('Clé incorrecte.')
            }}
            className="mt-4"
          >
            <label htmlFor="seller-key" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
              Clé d’accès
            </label>
            <input
              id="seller-key"
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="BP-ADMIN-…"
              className="field mt-1.5"
            />
            {error && <p className="mt-2 text-[11.5px] text-rose">{error}</p>}
            <button type="submit" className="btn-dark mt-3 w-full">
              Entrer
            </button>
          </form>
          <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-[10.5px] leading-relaxed text-inkSoft">
            Clé de démonstration : <code className="font-mono text-ink">BP-ADMIN-2026</code> — à
            changer dans <code>src/lib/orders.js</code>.
          </p>
          <button type="button" onClick={onBack} className="mt-3 text-[11px] text-inkSoft hover:text-ink">
            ← Retour à la boutique
          </button>
        </div>
      </div>
    )
  }

  return <SellerDashboard onBack={onBack} onLock={() => { lockSeller(); setUnlocked(false) }} />
}

function SellerDashboard({ onBack, onLock }) {
  const { orders, stats, changeStatus, sendMessage, updateOrder, loadDemo, clearDemo, findOrders, importOrder } =
    useOrders()
  const [selectedRef, setSelectedRef] = useState(() => orders[0]?.reference ?? null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [lookup, setLookup] = useState('')
  const [lookupResult, setLookupResult] = useState(null)
  const [imported, setImported] = useState(null)
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(null)

  const selected = useMemo(
    () => orders.find((order) => order.reference === selectedRef) ?? orders[0] ?? null,
    [orders, selectedRef],
  )

  useEffect(() => {
    if (!selected && orders[0]) setSelectedRef(orders[0].reference)
  }, [orders, selected])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((order) => {
      const statusOk =
        filter === 'all'
          ? true
          : filter === 'todo'
            ? ['paid', 'preparing'].includes(order.status)
            : filter === 'awaiting'
              ? order.status === 'awaiting_payment'
              : filter === 'shipped'
                ? ['shipped', 'relay_arrived', 'delivered'].includes(order.status)
                : true
      if (filter === 'todo' && order.status === 'awaiting_payment') return false
      if (!statusOk) return false
      if (!q) return true
      return (
        order.reference.toLowerCase().includes(q) ||
        String(order.clientNumber ?? '').includes(q.replace(/\D/g, '')) ||
        `${order.delivery.firstName} ${order.delivery.lastName}`.toLowerCase().includes(q) ||
        (order.delivery.email ?? '').toLowerCase().includes(q) ||
        (order.delivery.phone ?? '').replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        (order.delivery.city ?? '').toLowerCase().includes(q) ||
        (order.delivery.zip ?? '').includes(q)
      )
    })
  }, [orders, filter, query])

  const copy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /* presse-papiers indisponible */
    }
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const text = selected ? orderToText(selected) : ''

  return (
    <div className="container-x py-8 lg:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Tableau de bord</p>
          <h1 className="mt-1 font-serif text-[clamp(1.7rem,3vw,2.4rem)] leading-tight">
            Commandes & clientes
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {orders.length === 0 ? (
            <button type="button" onClick={loadDemo} className="btn-gold text-[10.5px]">
              <Icon name="sparkle" className="h-3.5 w-3.5" />
              Charger 4 commandes d’exemple
            </button>
          ) : (
            <button type="button" onClick={clearDemo} className="text-[10px] uppercase tracking-[0.1em] text-inkSoft hover:text-ink">
              Retirer les exemples
            </button>
          )}
          <button type="button" onClick={onBack} className="btn-outline text-[10.5px]">
            Voir la boutique
          </button>
          <button type="button" onClick={onLock} className="btn-outline text-[10.5px]">
            <Icon name="logout" className="h-3.5 w-3.5" />
            Verrouiller
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-goldDeep/35 bg-gold/8 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-goldDeep">
              Retrouver une commande
            </p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-inkSoft">
              Collez le numéro cliente à 6 chiffres reçu sur Discord / Telegram, ou le code
              <code className="mx-1 font-mono text-[10.5px]">BP-482913-eyJ…</code> reçu de la cliente.
            </p>
          </div>
          {imported && (
            <span className="badge bg-sage/15 text-[9.5px] text-sage">
              <Icon name="check" className="h-2.5 w-2.5" /> Commande {imported} importée
            </span>
          )}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const value = lookup.trim()
            setImported(null)
            const code = extractOrderCode(value) ?? (isOrderCode(value) ? value : null)
            if (code) {
              const decoded = decodeOrderCode(code)
              if (decoded) {
                importOrder(decoded)
                setSelectedRef(decoded.reference)
                setImported(decoded.reference)
                setLookupResult(null)
                setFilter('all')
                setQuery(decoded.clientNumber ?? decoded.reference)
                return
              }
              setLookupResult({ error: 'Ce code est incomplet ou abîmé. Demandez-le à nouveau à la cliente.' })
              return
            }
            const matches = findOrders(value)
            if (matches.length === 0) {
              setLookupResult({
                error: `Aucune commande pour « ${value} ». Si la commande a été passée sur l’appareil de la cliente, demandez-lui son code BP-… (bouton « Copier mon code de commande » sur sa confirmation).`,
              })
              return
            }
            setLookupResult({ matches })
            setSelectedRef(matches[0].reference)
            setQuery(String(matches[0].clientNumber ?? value))
            setFilter('all')
          }}
          className="mt-2 flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              value={lookup}
              onChange={(event) => setLookup(event.target.value)}
              placeholder="482913  ou  BP-482913-eyJ2Ijox…"
              className="field pl-9 font-mono text-[12px]"
              aria-label="Numéro cliente ou code de commande"
            />
            <Icon name="key" className="absolute left-3 top-2.5 h-4 w-4 text-inkSoft" />
          </div>
          <button type="submit" className="btn-gold text-[10.5px]">
            <Icon name="search" className="h-3.5 w-3.5" />
            Ouvrir la commande
          </button>
        </form>

        {lookupResult?.error && (
          <p className="mt-2 rounded-lg bg-rose/10 px-3 py-2 text-[11.5px] leading-relaxed text-rose">
            {lookupResult.error}
          </p>
        )}
        {lookupResult?.matches && lookupResult.matches.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lookupResult.matches.map((order) => (
              <button
                key={order.reference}
                type="button"
                onClick={() => setSelectedRef(order.reference)}
                className={`rounded-full border px-2.5 py-1 text-[10px] ${
                  selected?.reference === order.reference
                    ? 'border-forest bg-forest text-cream'
                    : 'border-ink/15 text-inkSoft hover:text-ink'
                }`}
              >
                {formatClientNumber(order.clientNumber)} · {order.delivery.firstName} ·{' '}
                {order.delivery.city}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { label: 'Commandes', value: stats.total, icon: 'bag' },
          { label: 'Chiffre payé', value: euro(stats.revenue), icon: 'coin' },
          { label: 'À préparer', value: stats.toPrepare, icon: 'box' },
          { label: 'Messages non lus', value: stats.unread, icon: 'chat' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-ink/10 bg-cream/40 p-3.5">
            <Icon name={card.icon} className="h-4 w-4 text-goldDeep" />
            <p className="mt-1.5 font-serif text-[22px] leading-none">{card.value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-inkSoft">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] [&>*]:min-w-0">
        <div className="min-w-0 rounded-2xl border border-ink/10 bg-ivory">
          <div className="border-b border-ink/10 p-3">
            <div className="relative">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Référence, nom, ville…"
                className="field pl-8"
              />
              <Icon name="search" className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-inkSoft" />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'awaiting', label: 'Paiement' },
                { id: 'todo', label: 'À préparer' },
                { id: 'shipped', label: 'Expédiées' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  aria-pressed={filter === tab.id}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.06em] transition-colors ${
                    filter === tab.id ? 'bg-ink text-ivory' : 'bg-cream text-inkSoft hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <ul className="max-h-[560px] divide-y divide-ink/10 overflow-y-auto">
            {visible.length === 0 && (
              <li className="p-5 text-center text-[12px] leading-relaxed text-inkSoft">
                Aucune commande ici.
                <br />
                Passez une commande depuis la boutique pour voir arriver la fiche complète.
              </li>
            )}
            {visible.map((order) => {
              const status = statusById(order.status)
              const unread = (order.messages ?? []).filter((m) => m.from === 'client' && !m.read).length
              return (
                <li key={order.reference}>
                  <button
                    type="button"
                    onClick={() => setSelectedRef(order.reference)}
                    className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors ${
                      selected?.reference === order.reference ? 'bg-cream/70' : 'hover:bg-cream/40'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-medium text-ink">{order.reference}</span>
                        {unread > 0 && (
                          <span className="rounded-full bg-goldDeep px-1.5 text-[9px] font-semibold text-ivory">
                            {unread}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-ink">
                        {order.delivery.firstName} {order.delivery.lastName} · {order.delivery.city}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-inkSoft">
                        {fmt(order.createdAt)} · {order.items.length} art.
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className={`badge px-2 py-0.5 text-[9px] ${toneClass(status.tone)}`}>
                        {status.short}
                      </span>
                      <span className="mt-1 block text-[12px] font-medium">{euro(order.amounts.total)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {selected ? (
          <div className="min-w-0 space-y-3">
            <div className="rounded-2xl border border-ink/10 bg-ivory p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="flex flex-wrap items-center gap-2 font-mono text-[12px] text-inkSoft">
                    {selected.reference}
                    {selected.clientNumber && (
                      <span className="rounded-full bg-gold/20 px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] text-goldDeep">
                        N° {formatClientNumber(selected.clientNumber)}
                      </span>
                    )}
                  </p>
                  <h2 className="font-serif text-[22px] leading-tight">
                    {selected.delivery.firstName} {selected.delivery.lastName}
                  </h2>
                  <p className="text-[11.5px] text-inkSoft">
                    {selected.delivery.email || '—'} · {selected.delivery.phone || '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl">{euro(selected.amounts.total)}</p>
                  <p className="text-[10.5px] text-inkSoft">{selected.payment.amount}</p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-cream/60 p-2.5">
                  <p className="text-[9.5px] uppercase tracking-[0.1em] text-inkSoft">Adresse de livraison</p>
                  <p className="mt-1 text-[12px] font-medium text-ink">{deliveryLabel(selected)}</p>
                  <p className="text-[11.5px] leading-relaxed text-inkSoft">
                    {selected.delivery.pickup ? selected.delivery.pickup.name : selected.delivery.address}
                    <br />
                    {selected.delivery.pickup ? selected.delivery.pickup.address : ''}
                    <br />
                    {selected.delivery.zip} {selected.delivery.city}, {selected.delivery.country}
                    {selected.delivery.pickup ? ` · ${selected.delivery.pickup.hours}` : ''}
                  </p>
                  {selected.delivery.notes && (
                    <p className="mt-1 text-[11px] italic text-inkSoft">« {selected.delivery.notes} »</p>
                  )}
                </div>
                <div className="rounded-lg bg-cream/60 p-2.5">
                  <p className="text-[9.5px] uppercase tracking-[0.1em] text-inkSoft">Paiement crypto</p>
                  <p className="mt-1 text-[12px] font-medium text-ink">
                    {selected.payment.assetName} · {selected.payment.network}
                  </p>
                  <p className="break-all font-mono text-[9.5px] leading-relaxed text-inkSoft">
                    {selected.payment.txHash || 'Aucun hash transmis'}
                  </p>
                  <label className="mt-1.5 block text-[9.5px] uppercase tracking-[0.1em] text-inkSoft">
                    Hash / note de vérification
                  </label>
                  <input
                    defaultValue={selected.payment.txHash ?? ''}
                    onBlur={(event) =>
                      updateOrder(selected.reference, {
                        payment: { ...selected.payment, txHash: event.target.value.trim() || null },
                      })
                    }
                    placeholder="0x…"
                    className="field mt-1 font-mono text-[10px]"
                  />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[9.5px] uppercase tracking-[0.1em] text-inkSoft">Articles</p>
                <ul className="mt-1 space-y-1">
                  {selected.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-[11.5px]">
                      <span>
                        {item.qty} × {item.name}{' '}
                        <span className="text-inkSoft">({item.brand})</span>
                      </span>
                      <span>{euro(item.line)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <p className="text-[9.5px] uppercase tracking-[0.1em] text-inkSoft">Faire avancer la commande</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status.id}
                      type="button"
                      onClick={() => {
                        changeStatus(selected.reference, status.id)
                        setDraft(fillTemplate(status.template, selected))
                      }}
                      aria-pressed={selected.status === status.id}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                        selected.status === status.id
                          ? 'border-forest bg-forest text-cream'
                          : 'border-ink/15 text-inkSoft hover:border-ink/40 hover:text-ink'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[10px] text-inkSoft">
                  Changer le statut prépare automatiquement le message à envoyer à la cliente.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-ivory">
              <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2.5">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-inkSoft">
                  <Icon name="chat" className="h-3.5 w-3.5 text-goldDeep" />
                  Message privé
                </p>
                <span className="text-[10px] text-inkSoft">
                  {(selected.messages ?? []).length} message(s)
                </span>
              </div>

              <div className="max-h-56 space-y-2 overflow-y-auto px-4 py-3">
                {(selected.messages ?? []).length === 0 && (
                  <p className="text-[11.5px] leading-relaxed text-inkSoft">
                    Aucun échange. Écrivez le premier message — il apparaît dans le suivi de la
                    cliente.
                  </p>
                )}
                {(selected.messages ?? []).map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[86%] rounded-2xl px-3 py-2 text-[11.5px] leading-relaxed ${
                      message.from === 'shop' ? 'ml-auto bg-forest text-cream' : 'bg-cream text-ink'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.body}</p>
                    <p className={`mt-1 text-[9px] ${message.from === 'shop' ? 'text-cream/60' : 'text-inkSoft'}`}>
                      {message.from === 'shop' ? 'Vous (boutique)' : 'Cliente'} · {fmt(message.at)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-ink/10 p-3">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={3}
                  placeholder="Bonjour Camille, votre colis part demain matin…"
                  className="field resize-none text-[11.5px]"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!draft.trim()) return
                      sendMessage(selected.reference, { from: 'shop', body: draft })
                      setDraft('')
                    }}
                    className="btn-dark text-[10px]"
                  >
                    <Icon name="send" className="h-3.5 w-3.5" />
                    Envoyer dans le suivi
                  </button>
                  <a href={telegramShare(draft)} target="_blank" rel="noreferrer" className="btn-outline text-[10px]">
                    Telegram
                  </a>
                  <a href={whatsappShare(draft)} target="_blank" rel="noreferrer" className="btn-outline text-[10px]">
                    WhatsApp
                  </a>
                  <a href={smsShare(selected, draft)} className="btn-outline text-[10px]">
                    SMS
                  </a>
                  <a href={mailtoShare(selected, draft)} className="btn-outline text-[10px]">
                    E-mail
                  </a>
                </div>
                <p className="mt-1.5 text-[10px] text-inkSoft">
                  « Envoyer dans le suivi » écrit dans la messagerie que la cliente voit sur
                  <code className="mx-1 font-mono">#suivi/{selected.reference}</code>.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-forest/25 bg-forest/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-forest">
                Fiche à coller sur Discord / Telegram
              </p>
              <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-ivory px-3 py-2.5 font-sans text-[10.5px] leading-relaxed text-inkSoft">
                {text}
              </pre>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button type="button" onClick={() => copy(text, 'fiche')} className="btn-outline text-[10px]">
                  <Icon name={copied === 'fiche' ? 'check' : 'copy'} className="h-3.5 w-3.5" />
                  {copied === 'fiche' ? 'Copié' : 'Copier la fiche'}
                </button>
                <button
                  type="button"
                  onClick={() => copy(selected.delivery.address, 'addr')}
                  className="btn-outline text-[10px]"
                >
                  <Icon name="pin" className="h-3.5 w-3.5" />
                  Copier l’adresse
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-ink/20 p-6 text-center text-[12px] leading-relaxed text-inkSoft">
            Sélectionnez une commande à gauche pour voir l’adresse, le point relais et écrire à la
            cliente.
          </div>
        )}
      </div>
    </div>
  )
}
