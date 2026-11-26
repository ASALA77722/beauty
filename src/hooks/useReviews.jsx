import { useCallback, useMemo, useState } from 'react'
import { BRAND_REPLIES, REVIEWS, getCustomer, ratingBreakdown } from '../data/reviews'

/** Notes « utiles » votées localement, pour rendre les boutons vivants. */
export function useReviews(productId = null) {
  const [helpfulVotes, setHelpfulVotes] = useState(() => new Set())
  const [filter, setFilter] = useState('all')

  const all = useMemo(
    () => (productId ? REVIEWS.filter((review) => review.productId === productId) : REVIEWS),
    [productId],
  )

  const reviews = useMemo(() => {
    const list = all.map((review) => ({
      ...review,
      customer: getCustomer(review.customerId),
      reply: BRAND_REPLIES[review.id] ?? null,
      markedHelpful: helpfulVotes.has(review.id),
      helpfulCount: review.helpful + (helpfulVotes.has(review.id) ? 1 : 0),
    }))

    const filtered =
      filter === 'all'
        ? list
        : filter === 'photos'
          ? []
          : filter === 'positive'
            ? list.filter((review) => review.rating >= 4)
            : filter === 'negative'
              ? list.filter((review) => review.rating <= 3)
              : list

    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [all, filter, helpfulVotes])

  const toggleHelpful = useCallback((id) => {
    setHelpfulVotes((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const stats = useMemo(() => {
    const enriched = all.map((review) => ({
      ...review,
      customer: getCustomer(review.customerId),
    }))
    const breakdown = ratingBreakdown(enriched)
    const verified = enriched.filter((review) => review.orderRef).length
    const recommend = enriched.filter((review) => review.wouldRecommend === true).length
    return {
      ...breakdown,
      verified,
      recommendPercent: enriched.length ? Math.round((recommend / enriched.length) * 100) : 0,
      raw: enriched,
    }
  }, [all])

  return { reviews, stats, filter, setFilter, toggleHelpful }
}

/** Toutes les statistiques, tous produits confondus. */
export function getAllReviewsStats() {
  const enriched = REVIEWS.map((review) => ({ ...review, customer: getCustomer(review.customerId) }))
  return {
    ...ratingBreakdown(enriched),
    verified: enriched.filter((r) => r.orderRef).length,
    recommendPercent: Math.round(
      (enriched.filter((r) => r.wouldRecommend === true).length / enriched.length) * 100,
    ),
  }
}

export const reviewsForProduct = (productId) =>
  REVIEWS.filter((review) => review.productId === productId).map((review) => ({
    ...review,
    customer: getCustomer(review.customerId),
  }))
