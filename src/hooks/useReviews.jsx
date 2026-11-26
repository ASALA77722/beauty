import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  addReview,
  canEdit,
  loadReviews,
  publicName,
  ratingBreakdown,
  reviewsForProduct,
} from '../data/reviews'

const SORTS = {
  recent: (a, b) => new Date(b.date) - new Date(a.date),
  best: (a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date),
  worst: (a, b) => a.rating - b.rating || new Date(b.date) - new Date(a.date),
}

/** Avis d'un produit (ou tous), avec tri et filtres. */
export function useReviews(productId = null) {
  const [version, setVersion] = useState(0)
  const [sort, setSort] = useState('recent')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const sync = () => setVersion((value) => value + 1)
    window.addEventListener('beaute-reviews-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('beaute-reviews-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const all = useMemo(
    () => (productId ? reviewsForProduct(productId) : loadReviews()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productId, version],
  )

  const enriched = useMemo(
    () =>
      all.map((review) => ({
        ...review,
        author: publicName(review.name),
        initials: (publicName(review.name).replace(/[^A-Za-zÀ-ÿ]/g, '') || 'C')
          .slice(0, 2)
          .toUpperCase(),
        editable: canEdit(review),
      })),
    [all],
  )

  const reviews = useMemo(() => {
    const list = enriched.filter((review) => {
      if (filter === 'photos') return (review.photos ?? []).length > 0
      if (filter === 'positive') return review.rating >= 4
      if (filter === 'negative') return review.rating <= 3
      return true
    })
    return [...list].sort(SORTS[sort] ?? SORTS.recent)
  }, [enriched, filter, sort])

  const stats = useMemo(() => ratingBreakdown(all), [all])

  return { reviews, stats, sort, setSort, filter, setFilter }
}

/** Statistiques globales, tous produits confondus. */
export function useGlobalReviews() {
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const sync = () => setVersion((value) => value + 1)
    window.addEventListener('beaute-reviews-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('beaute-reviews-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return useMemo(() => ratingBreakdown(loadReviews()), [version])
}

/** Dépôt d'un avis. */
export function useSubmitReview() {
  return useCallback((payload) => {
    const review = {
      id: `r${Date.now()}`,
      productId: payload.productId,
      rating: payload.rating,
      title: payload.title.trim(),
      body: payload.body.trim(),
      name: payload.name.trim(),
      orderRef: payload.orderRef?.trim() || null,
      city: payload.city?.trim() || null,
      date: new Date().toISOString(),
      wouldRecommend: payload.wouldRecommend,
      reply: null,
    }
    addReview(review)
    return review
  }, [])
}
