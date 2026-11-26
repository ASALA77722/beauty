export const euro = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)

export const FREE_SHIPPING_THRESHOLD = 35
export const SHIPPING_COST = 3.9

export const CART_KEY = 'beaute-cart-v2'
export const USER_KEY = 'beaute-user-v2'

export const discountPercent = (market, price) =>
  market > price ? Math.round(((market - price) / market) * 100) : 0

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

/** Normalise un numéro FR/CH/BE : ne conserve que les chiffres, avec indicatif. */
export const normalizePhone = (value) => {
  const digits = value.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('00')) return `+${digits.slice(2)}`
  if (digits.startsWith('0') && digits.length === 10) return `+33${digits.slice(1)}`
  return digits
}

export const isPhone = (value) => {
  const normalized = normalizePhone(value)
  return /^\+\d{8,15}$/.test(normalized)
}

/** Détecte automatiquement le type d'identifiant saisi. */
export const detectIdentifier = (value) => {
  const trimmed = value.trim()
  if (trimmed.includes('@')) return 'email'
  if (/[\d]/.test(trimmed) && !/[a-zA-Z]/.test(trimmed.replace(/^\+/, ''))) return 'phone'
  return null
}

/** Accès sûr au stockage (file:// peut le bloquer). */
const store = {
  get(key) {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* stockage indisponible */
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* stockage indisponible */
    }
  },
}

export const removeStored = (key) => store.remove(key)

export function readJson(key, fallback) {
  try {
    const raw = store.get(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  store.set(key, JSON.stringify(value))
}

export function readCart() {
  const parsed = readJson(CART_KEY, [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter(
    (item) => item && typeof item.id === 'string' && Number.isFinite(item.qty) && item.qty > 0,
  )
}
