/**
 * Code de commande auto-suffisant.
 *
 * Le site n'a pas de serveur : pour que la boutique puisse ouvrir une
 * commande passée sur l'appareil d'une cliente, la commande entière est
 * encodée dans un code court, lisible et copiable (base64url).
 *
 *   BP-482913-eyJ2IjoxLCJuIjoiNDgyOTEzIiwi…
 *
 * Le numéro cliente (6 chiffres) reste l'identifiant humain lisible,
 * le code est le « wagon » qui transporte les données.
 */

const b64encode = (bytes) => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const b64decode = (value) => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

const utf8 = (text) => new TextEncoder().encode(text)
const fromUtf8 = (bytes) => new TextDecoder().decode(bytes)

/**
 * Encode une commande dans un code copiable.
 * @param {object} order
 * @returns {string} BP-<numéro>-<charge>
 */
export function encodeOrderCode(order) {
  const compact = [
    1,
    order.reference,
    order.clientNumber ?? '',
    order.createdAt,
    order.status,
    order.delivery.mode,
    order.delivery.firstName,
    order.delivery.lastName,
    order.delivery.email ?? '',
    order.delivery.phone ?? '',
    order.delivery.address ?? '',
    order.delivery.zip ?? '',
    order.delivery.city ?? '',
    order.delivery.notes ?? '',
    order.delivery.pickup
      ? [
          order.delivery.pickup.name,
          order.delivery.pickup.address,
          order.delivery.pickup.zip,
          order.delivery.pickup.city,
          order.delivery.pickup.hours ?? '',
        ]
      : null,
    order.items.map((item) => [item.id, item.name, item.brand, item.qty, item.unit]),
    [
      order.amounts.subtotal,
      order.amounts.shipping,
      order.amounts.total,
      order.amounts.saved ?? 0,
      order.amounts.marketTotal ?? 0,
      order.amounts.discount ?? 0,
    ],
    [
      order.payment.asset,
      order.payment.network,
      order.payment.amount,
      order.payment.txHash ?? '',
      order.payment.address ?? '',
    ],
  ]
  return `BP-${order.clientNumber ?? '000000'}-${b64encode(utf8(JSON.stringify(compact)))}`
}

/** Vrai si la chaîne ressemble à un code de commande. */
export const isOrderCode = (value) => /^BP-\d{6}-[A-Za-z0-9\-_]{20,}$/.test((value ?? '').trim())

/** Extrait un code de commande d'un texte collé (fiche Discord, e-mail…). */
export function extractOrderCode(text) {
  const match = (text ?? '').match(/BP-\d{6}-[A-Za-z0-9\-_]{20,}/)
  return match ? match[0] : null
}

/**
 * Reconstruit une commande depuis un code.
 * @returns {object|null}
 */
export function decodeOrderCode(code) {
  try {
    const clean = (code ?? '').trim()
    if (!isOrderCode(clean)) return null
    const payload = JSON.parse(fromUtf8(b64decode(clean.slice(clean.indexOf('-', 3) + 1))))
    const [
      version,
      reference,
      clientNumber,
      createdAt,
      status,
      mode,
      firstName,
      lastName,
      email,
      phone,
      address,
      zip,
      city,
      notes,
      pickup,
      items,
      amounts,
      payment,
    ] = payload
    if (version !== 1 || !reference) return null

    return {
      reference,
      clientNumber,
      createdAt,
      updatedAt: createdAt,
      status: status || 'awaiting_payment',
      statusHistory: [{ status: status || 'awaiting_payment', at: createdAt }],
      imported: true,
      demo: false,
      items: (items ?? []).map(([id, name, brand, qty, unit]) => ({
        id,
        name,
        brand,
        qty,
        unit,
        line: Math.round(unit * qty * 100) / 100,
      })),
      amounts: {
        subtotal: amounts?.[0] ?? 0,
        shipping: amounts?.[1] ?? 0,
        total: amounts?.[2] ?? 0,
        saved: amounts?.[3] ?? 0,
        marketTotal: amounts?.[4] ?? 0,
        discount: amounts?.[5] ?? 0,
      },
      payment: {
        method: 'crypto',
        asset: payment?.[0] ?? 'USDT',
        assetName: ASSET_NAMES[payment?.[0] ?? 'USDT'] ?? 'Crypto',
        network: payment?.[1] ?? '',
        amount: payment?.[2] ?? '',
        rawAmount: 0,
        eurAmount: amounts?.[2] ?? 0,
        address: payment?.[4] ?? '',
        txHash: payment?.[3] || null,
        declaredAt: null,
        confirmedAt: null,
      },
      delivery: {
        mode,
        firstName,
        lastName,
        email,
        phone,
        address,
        zip,
        city,
        country: 'France',
        notes,
        pickup: pickup
          ? { id: 'imported', name: pickup[0], address: pickup[1], zip: pickup[2], city: pickup[3], hours: pickup[4] }
          : null,
      },
      messages: [],
      clientKey: (email || phone || '').toLowerCase(),
    }
  } catch {
    return null
  }
}

/** Devise lisible (assetName) déduite du symbole. */
const ASSET_NAMES = {
  USDT: 'Tether (USDT)',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
}

/** Numéro cliente : 6 chiffres, jamais deux fois le même sur l'appareil. */
export function makeClientNumber(existing = []) {
  const taken = new Set(existing.map((order) => order.clientNumber).filter(Boolean))
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const value = String(Math.floor(100000 + Math.random() * 900000))
    if (!taken.has(value)) return value
  }
  return String(Date.now()).slice(-6)
}

/** 482913 → « 482 913 » */
export const formatClientNumber = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (digits.length !== 6) return digits
  return `${digits.slice(0, 3)} ${digits.slice(3)}`
}

export const normalizeClientNumber = (value) => String(value ?? '').replace(/\D/g, '')
