import { AUTO_OFFERS, PROMO_CODES, finalPrice } from '../data/shop'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from './format'

/**
 * Calcule toutes les remises d'un panier.
 * @param {Array<{product: object, qty: number}>} items
 * @param {{code?: string|null, payment?: string|null}} options
 */
export function computeTotals(items, { code = null, payment = null } = {}) {
  const subtotal = items.reduce((sum, item) => sum + finalPrice(item.product) * item.qty, 0)
  const marketTotal = items.reduce((sum, item) => sum + item.product.marketPrice * item.qty, 0)
  const count = items.reduce((sum, item) => sum + item.qty, 0)

  // 1. Offre automatique la plus avantageuse
  const orderDiscount = (percent) => Math.round(subtotal * percent) / 100

  // prix unitaires triés, pour l'offre « −10 % sur le 2ᵉ »
  const unitPrices = items
    .flatMap((item) => Array.from({ length: item.qty }, () => finalPrice(item.product)))
    .sort((a, b) => a - b)

  const candidates = []
  for (const offer of AUTO_OFFERS) {
    if (count < offer.minQty) continue
    const amount =
      offer.kind === 'second-unit'
        ? Math.round(unitPrices[1] * offer.percent) / 100
        : orderDiscount(offer.percent)
    candidates.push({
      id: offer.id,
      label: offer.label,
      description: offer.description,
      amount,
    })
  }
  const autoOffer = candidates.sort((a, b) => b.amount - a.amount)[0] ?? null

  // 2. Code promo
  let promo = null
  let promoError = null
  if (code) {
    const promoCode = PROMO_CODES[code.toUpperCase()]
    if (!promoCode) {
      promoError = 'Code inconnu.'
    } else if (subtotal < promoCode.minSubtotal) {
      promoError = `Ce code s'applique dès ${promoCode.minSubtotal} € d'achat.`
    } else {
      promo = {
        code: promoCode.code,
        label: promoCode.label,
        amount:
          promoCode.type === 'percent'
            ? Math.round(((subtotal * promoCode.value) / 100) * 100) / 100
            : 0,
        freeShipping: promoCode.type === 'shipping',
      }
    }
  }

  // 3. Remise moyen de paiement
  const paymentDiscount = payment ? Number(payment.discount) || 0 : 0
  const paymentAmount =
    paymentDiscount > 0 ? Math.round(((subtotal * paymentDiscount) / 100) * 100) / 100 : 0

  const autoAmount = autoOffer?.amount ?? 0
  const promoAmount = promo?.amount ?? 0
  const totalDiscount = autoAmount + promoAmount + paymentAmount

  const discountedSubtotal = Math.max(0, subtotal - totalDiscount)
  const shippingFree =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD ||
    Boolean(promo?.freeShipping) ||
    subtotal === 0
  const shipping = shippingFree ? 0 : SHIPPING_COST
  const total = Math.round((discountedSubtotal + shipping) * 100) / 100

  return {
    count,
    subtotal,
    marketTotal,
    saved: Math.round((marketTotal - subtotal) * 100) / 100,
    autoOffer,
    promo,
    promoError,
    paymentAmount,
    paymentLabel: payment?.label ?? null,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    shipping,
    shippingFree,
    total,
    // économie affichée : écart prix marché + remises du panier
    totalSaved: Math.round((marketTotal - subtotal + totalDiscount) * 100) / 100,
  }
}
