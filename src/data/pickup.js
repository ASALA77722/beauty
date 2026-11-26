// ─────────────────────────────────────────────────────────────
// Points relais pris en charge par la boutique.
// La recherche filtre cette liste par code postal ou par ville, et la
// cliente peut toujours saisir elle-même un autre relais de son secteur.
// ─────────────────────────────────────────────────────────────

export const PICKUP_POINTS = []

/**
 * Les points relais ne sont pas inventés : la boutique les transmet à la
 * commande (par e-mail ou via le suivi) une fois le colis expédié.
 * La cliente indique simplement la ville ou le point de retrait souhaité.
 */

/** Recherche dans la liste réellement configurée (vide par défaut). */
export const searchPickupPoints = (query, limit = 6) => {
  const q = (query ?? '').trim().toLowerCase()
  if (q.length < 2) return []
  const byZip = PICKUP_POINTS.filter((point) => point.zip.startsWith(q))
  const byCity = PICKUP_POINTS.filter(
    (point) => !point.zip.startsWith(q) && point.city.toLowerCase().includes(q),
  )
  return [...byZip, ...byCity].slice(0, limit)
}

export const pickupPointById = (id) => PICKUP_POINTS.find((point) => point.id === id) ?? null
