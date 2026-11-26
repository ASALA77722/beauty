// ─────────────────────────────────────────────────────────────
// Avis clients — uniquement des avis réellement déposés.
// Aucun avis n'est pré-rempli : le site n'affiche que ce que les
// clientes ont écrit, et le dit clairement quand il n'y en a pas
// encore assez pour calculer une moyenne.
// ─────────────────────────────────────────────────────────────

export const REVIEWS_KEY = 'beaute-reviews-v1'

const read = () => {
  try {
    const raw = window.localStorage.getItem(REVIEWS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const write = (list) => {
  try {
    window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(list))
  } catch {
    /* stockage indisponible */
  }
}

export const loadReviews = () => read()

export const addReview = (review) => {
  const list = [review, ...read()]
  write(list)
  window.dispatchEvent(new Event('beaute-reviews-updated'))
  return list
}

/** Un avis ne peut plus être modifié au-delà de 24 h (règle affichée). */
export const canEdit = (review) => Date.now() - new Date(review.date).getTime() < 86400000

export const reviewsForProduct = (productId) =>
  read()
    .filter((review) => review.productId === productId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

/**
 * Statistiques honnêtes : la moyenne n'est affichée qu'à partir de 3 avis,
 * pour éviter une note calculée sur un seul témoignage.
 */
export function ratingBreakdown(reviews) {
  const total = reviews.length
  const rows = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length
    return { star, count, percent: total ? Math.round((count / total) * 100) : 0 }
  })
  const average = total
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / total) * 10) / 10
    : 0
  const recommend = reviews.filter((review) => review.wouldRecommend === true).length
  return {
    rows,
    total,
    average,
    verified: reviews.filter((review) => review.orderRef).length,
    recommendPercent: total ? Math.round((recommend / total) * 100) : 0,
    reliable: total >= 3,
  }
}

/** Prénom + initiale : « Camille R. » — jamais de nom complet publié. */
export const publicName = (name) => {
  const parts = (name ?? '').trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return 'Cliente'
  return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0]
}
