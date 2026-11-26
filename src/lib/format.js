export const euro = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)

export const FREE_SHIPPING_THRESHOLD = 60
export const SHIPPING_COST = 4.9

export const STORAGE_KEY = 'maison-lumiere-cart'

export function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) => item && typeof item.id === 'string' && Number.isFinite(item.qty) && item.qty > 0,
    )
  } catch {
    return []
  }
}

export function writeCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* stockage indisponible : on continue en mémoire */
  }
}
