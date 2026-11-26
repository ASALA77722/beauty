import { readJson, writeJson } from './format'
import {
  SELLER_KEY,
  cryptoById,
  formatCrypto,
  toCryptoAmount,
  walletAddress,
  splitActive,
  splitBreakdown,
  SPLIT,
} from '../config'
import { encodeOrderCode } from './code'

export const ORDERS_V3_KEY = 'beaute-orders-v3'
export const SELLER_KEY_STORAGE = 'beaute-seller-v1'

export const ORDER_STATUSES = [
  {
    id: 'awaiting_payment',
    label: 'Paiement en attente',
    short: 'En attente',
    tone: 'gold',
    client: 'Nous n’avons pas encore vu arriver votre transaction crypto.',
    template:
      'Bonjour {prenom}, votre commande {ref} est enregistrée. Nous attendons la confirmation de votre paiement {asset} sur le réseau {network}. Dès les confirmations reçues, nous préparons votre colis (sous 24 h ouvrées).',
  },
  {
    id: 'paid',
    label: 'Paiement confirmé',
    short: 'Payée',
    tone: 'sage',
    client: 'Paiement reçu — votre colis part en préparation.',
    template:
      'Bonjour {prenom}, paiement bien reçu pour la commande {ref} ({montant}). Merci ! Votre colis est en préparation dans notre atelier parisien, expédition sous 24 h ouvrées. Précision : l’emballage est neutre, sans mention de beauté ni de parfum.',
  },
  {
    id: 'preparing',
    label: 'En préparation',
    short: 'Préparation',
    tone: 'gold',
    client: 'Votre colis est emballé, l’étiquette est imprimée.',
    template:
      'Bonjour {prenom}, votre commande {ref} est emballée. Nous déposons le colis au transporteur demain matin. Vous recevrez le numéro de suivi dans la journée.',
  },
  {
    id: 'shipped',
    label: 'Expédiée',
    short: 'Expédiée',
    tone: 'gold',
    client: 'Le colis circule vers votre point de livraison.',
    template:
      'Bonjour {prenom}, votre colis {ref} est parti ! Numéro de suivi : {suivi}. Livraison prévue {delai}. {relais}',
  },
  {
    id: 'relay_arrived',
    label: 'Arrivé au point relais',
    short: 'En relais',
    tone: 'sage',
    client: 'Le colis vous attend au point relais.',
    template:
      'Bonjour {prenom}, votre colis {ref} est arrivé. Vous avez 8 jours pour le retirer, avec une pièce d’identité et le code {code}. {relais}',
  },
  {
    id: 'delivered',
    label: 'Livrée',
    short: 'Livrée',
    tone: 'sage',
    client: 'Colis remis. Merci pour votre confiance !',
    template:
      'Bonjour {prenom}, votre commande {ref} vous a bien été remise. J’espère que les soins vous plaisent — si vous avez deux minutes, votre avis sur le site nous aide beaucoup. Belle journée !',
  },
  {
    id: 'cancelled',
    label: 'Annulée',
    short: 'Annulée',
    tone: 'rose',
    client: 'Commande annulée, remboursement en cours.',
    template:
      'Bonjour {prenom}, votre commande {ref} est annulée. Le remboursement en {asset} est envoyé sur l’adresse de départ sous 24 h. Toutes nos excuses pour la gêne.',
  },
]

export const statusById = (id) => ORDER_STATUSES.find((status) => status.id === id) ?? ORDER_STATUSES[1]

export const nextStatuses = (current) =>
  ORDER_STATUSES.filter(
    (status) => status.id !== current && status.id !== 'cancelled' && status.id !== 'awaiting_payment',
  )

const pad = (value) => String(value).padStart(2, '0')

/** Référence lisible : BP-YYMMDD-XXXX. */
export const makeReference = () => {
  const now = new Date()
  const suffix = String(Math.floor(1000 + Math.random() * 9000))
  return `BP-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${suffix}`
}

/** Construit l'objet commande complet à partir du panier et du formulaire. */
export function buildOrder({ items, totals, form, deliveryMode, pickup, wallet, reference, clientNumber }) {
  const asset = cryptoById(wallet)
  const ref = reference ?? makeReference()
  const amount = toCryptoAmount(totals.total, asset)
  const order = {
    reference: ref,
    clientNumber: clientNumber ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'awaiting_payment',
    statusHistory: [{ status: 'awaiting_payment', at: new Date().toISOString() }],
    items: items.map(({ product, qty }) => ({
      id: product.id,
      name: product.name,
      brand: product.line,
      qty,
      unit: Math.round(product.price * 100) / 100,
      line: Math.round(product.price * qty * 100) / 100,
      image: product.image,
    })),
    amounts: {
      subtotal: totals.subtotal,
      marketTotal: totals.marketTotal,
      discount: totals.totalDiscount,
      shipping: totals.shipping,
      total: totals.total,
      saved: totals.totalSaved,
    },
    payment: {
      method: 'crypto',
      asset: asset.symbol,
      assetName: asset.name,
      network: asset.network,
      address: null,
      amount: formatCrypto(amount, asset),
      /** Répartition enregistrée à la vente : le vendeur sait quoi reverser. */
      split: splitActive()
        ? {
            ...splitBreakdown(totals.total),
            partnerLabel: SPLIT.partnerLabel,
            provider: SPLIT.provider,
            status: 'to_transfer',
          }
        : null,
      rawAmount: amount,
      eurAmount: totals.total,
      txHash: null,
      declaredAt: null,
      confirmedAt: null,
    },
    delivery: {
      mode: deliveryMode,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: deliveryMode === 'pickup' ? pickup.address : form.address.trim(),
      zip: deliveryMode === 'pickup' ? pickup.zip : form.zip.trim(),
      city: deliveryMode === 'pickup' ? pickup.city : form.city.trim(),
      country: form.country || 'France',
      notes: form.notes?.trim() || '',
      pickup: deliveryMode === 'pickup' ? pickup : null,
    },
    messages: [],
    clientKey: (form.email || form.phone || '').trim().toLowerCase(),
  }
  return order
}

/* ── Stockage ─────────────────────────────────────────────── */

export const loadOrders = () => {
  const stored = readJson(ORDERS_V3_KEY, [])
  return Array.isArray(stored) ? stored : []
}

export const saveOrders = (orders) => writeJson(ORDERS_V3_KEY, orders)

export const addOrder = (order) => {
  const orders = loadOrders()
  saveOrders([order, ...orders])
  return order
}

export const patchOrder = (reference, patch) => {
  const orders = loadOrders().map((order) =>
    order.reference === reference
      ? { ...order, ...patch, updatedAt: new Date().toISOString() }
      : order,
  )
  saveOrders(orders)
  return orders
}

export const setStatus = (reference, status) => {
  const order = loadOrders().find((item) => item.reference === reference)
  if (!order) return loadOrders()
  const history = [...(order.statusHistory ?? []), { status, at: new Date().toISOString() }]
  return patchOrder(reference, { status, statusHistory: history })
}

let messageSeq = 0
export const appendMessage = (reference, { from, body }) => {
  const order = loadOrders().find((item) => item.reference === reference)
  if (!order) return loadOrders()
  messageSeq += 1
  const message = {
    id: `m${Date.now()}${messageSeq}`,
    from,
    body: body.trim(),
    at: new Date().toISOString(),
    read: from === 'shop',
  }
  return patchOrder(reference, { messages: [...(order.messages ?? []), message] })
}

export const markClientMessagesRead = (reference) => {
  const order = loadOrders().find((item) => item.reference === reference)
  if (!order) return loadOrders()
  return patchOrder(reference, {
    messages: (order.messages ?? []).map((message) =>
      message.from === 'client' ? { ...message, read: true } : message,
    ),
  })
}

/* ── Texte prêt à envoyer (Telegram / Discord / WhatsApp) ── */

export const deliveryLabel = (order) =>
  order.delivery.mode === 'pickup'
    ? `Point relais — ${order.delivery.pickup?.name ?? 'à confirmer'}`
    : 'Livraison à domicile'

export function orderToText(order, { includeAddress = true } = {}) {
  const status = statusById(order.status)
  const d = order.delivery
  const lines = [
    `🛍️ NOUVELLE COMMANDE ${order.reference}`,
    order.clientNumber ? `🔑 NUMÉRO CLIENTE : ${order.clientNumber}` : null,
    order.clientNumber ? `🧾 CODE COMMANDE : ${encodeOrderCode(order)}` : null,
    `Statut : ${status.label}`,
    `Montant : ${order.amounts.total} € — payé en ${order.payment.amount} (${order.payment.network})`,
    '',
    `👤 ${d.firstName} ${d.lastName}`,
    `📧 ${d.email || '—'} · 📱 ${d.phone || '—'}`,
  ]
  if (includeAddress) {
    lines.push(
      `📍 ${deliveryLabel(order)}`,
      `   ${d.address}`,
      `   ${d.zip} ${d.city}, ${d.country}`,
    )
    if (d.pickup) lines.push(`   ${d.pickup.hours}`)
    if (d.notes) lines.push(`   Note : ${d.notes}`)
  }
  lines.push(
    '',
    '📦 Articles',
    ...order.items.map(
      (item) => `   • ${item.qty} × ${item.name} (${item.brand}) — ${item.line} €`,
    ),
    '',
    `💸 Sous-total ${order.amounts.subtotal} € · Livraison ${
      order.amounts.shipping === 0 ? 'offerte' : `${order.amounts.shipping} €`
    }`,
    order.amounts.saved > 0 ? `✅ Économie cliente : ${order.amounts.saved} €` : null,
    order.payment.txHash ? `🔗 Tx : ${order.payment.txHash}` : '⏳ Transaction non encore transmise',
    '',
    `👉 Suivi : ${typeof window !== 'undefined' ? window.location.origin : ''}/#suivi/${order.reference}`,
  )
  return lines.filter(Boolean).join('\n')
}

export const telegramShare = (text) =>
  `https://t.me/share/url?url=${encodeURIComponent('https://asala77722.github.io/beauty/')}&text=${encodeURIComponent(text)}`

export const whatsappShare = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`

export const mailtoShare = (order, text) =>
  `mailto:${order.delivery.email || ''}?subject=${encodeURIComponent(
    `Votre commande ${order.reference} — Beauté Paris`,
  )}&body=${encodeURIComponent(text)}`

export const smsShare = (order, text) =>
  `sms:${order.delivery.phone || ''}?&body=${encodeURIComponent(text)}`

/** Remplace les variables d'un modèle de message. */
export function fillTemplate(template, order) {
  const settings = {
    prenom: order.delivery.firstName,
    ref: order.reference,
    montant: `${order.amounts.total} €`,
    asset: order.payment.asset,
    network: order.payment.network,
    suivi: '1Z-BP-0000-0000',
    delai: 'sous 48 h',
    code: String(order.reference).slice(-4),
    relais: order.delivery.pickup
      ? `Point relais : ${order.delivery.pickup.name}, ${order.delivery.pickup.address}, ${order.delivery.pickup.zip} ${order.delivery.pickup.city} (${order.delivery.pickup.hours}).`
      : `Livraison à domicile : ${order.delivery.address}, ${order.delivery.zip} ${order.delivery.city}.`,
  }
  return template.replace(/\{(\w+)\}/g, (_, key) => settings[key] ?? '')
}

export const isSellerUnlocked = () => {
  try {
    return window.sessionStorage.getItem(SELLER_KEY_STORAGE) === 'ok'
  } catch {
    return false
  }
}

export const unlockSeller = (key) => {
  if (key.trim() !== SELLER_KEY) {
    return false
  }
  try {
    window.sessionStorage.setItem(SELLER_KEY_STORAGE, 'ok')
  } catch {
    /* stockage indisponible */
  }
  return true
}

export const lockSeller = () => {
  try {
    window.sessionStorage.removeItem(SELLER_KEY_STORAGE)
  } catch {
    /* stockage indisponible */
  }
}
