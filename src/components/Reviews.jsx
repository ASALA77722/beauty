import { useState } from 'react'
import { PRODUCTS, brandOf } from '../data/shop'
import { useGlobalReviews, useReviews, useSubmitReview } from '../hooks/useReviews'
import { useAuth } from '../hooks/useAuth'
import {
  ORDER_STATUSES_LABELS_SHORT,
  loadOrdersForReview,
} from '../lib/reviewHelpers'
import Icon from './Icon'
import RatingSummary from './RatingSummary'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'

const SORTS = [
  { id: 'recent', label: 'Plus récents' },
  { id: 'best', label: 'Meilleures notes' },
  { id: 'worst', label: 'Notes les plus basses' },
]

export default function Reviews() {
  const [productFilter, setProductFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const globalStats = useGlobalReviews()

  return (
    <section id="avis" className="scroll-mt-24 bg-cream/40 py-16 lg:py-24">
      <div className="container-x">
        <div className="text-center">
          <p className="eyebrow">Avis clients</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-[clamp(1.9rem,4vw,3rem)] font-light leading-tight">
            Les avis de nos clientes,
            <br />
            <span className="italic text-goldDeep">publiés tels quels</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed text-inkSoft">
            {globalStats.total === 0
              ? 'Aucun avis pour le moment. Les avis apparaissent ici dès qu’une cliente en dépose un — nous ne rédigeons aucun témoignage à leur place.'
              : `${globalStats.total} avis déposé${globalStats.total > 1 ? 's' : ''} par nos clientes. Nous ne réécrivons pas les avis et nous n’en supprimons pas les critiques.`}
          </p>

          {globalStats.reliable && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[13px] font-medium text-ink">
                {globalStats.average}/5
              </span>
              <span className="text-[11px] text-inkSoft">
                · {globalStats.recommendPercent} % recommandent
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="btn-dark mt-5 text-[10.5px]"
          >
            <Icon name="star" className="h-3.5 w-3.5" />
            Écrire un avis
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setProductFilter('all')}
            aria-pressed={productFilter === 'all'}
            className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
              productFilter === 'all'
                ? 'border-ink bg-ink text-ivory'
                : 'border-ink/15 text-inkSoft hover:border-ink/40 hover:text-ink'
            }`}
          >
            Tous les produits
          </button>
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setProductFilter(product.id)}
              aria-pressed={productFilter === product.id}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                productFilter === product.id
                  ? 'border-forest bg-forest text-cream'
                  : 'border-ink/15 text-inkSoft hover:border-ink/40 hover:text-ink'
              }`}
            >
              {product.name}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <RatingSummary stats={globalStats} />
            <div className="mt-4 rounded-2xl border border-ink/10 bg-ivory p-5">
              <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
                <Icon name="shield" className="h-4 w-4 text-goldDeep" />
                Comment nous traitons les avis
              </p>
              <ul className="mt-2 space-y-1.5 text-[11.5px] leading-relaxed text-inkSoft">
                <li>· Chaque avis est publié immédiatement, sans réécriture.</li>
                <li>· Les avis négatifs restent en ligne, sans filtrage.</li>
                <li>· Un numéro de commande ajoute la mention « achat vérifié ».</li>
                <li>· Aucune moyenne n’est affichée en dessous de 3 avis.</li>
              </ul>
            </div>
          </div>

          <div>
            {productFilter === 'all' ? (
              <div className="space-y-9">
                {PRODUCTS.map((product) => (
                  <ProductReviewsBlock key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <ProductReviewsBlock
                product={PRODUCTS.find((item) => item.id === productFilter)}
                openByDefault
              />
            )}
          </div>
        </div>
      </div>

      {formOpen && <ReviewForm onClose={() => setFormOpen(false)} />}
    </section>
  )
}

/** Avis d'un produit : filtres, tri, liste réelle. */
function ProductReviewsBlock({ product, openByDefault = false }) {
  const { reviews, stats, sort, setSort, filter, setFilter } = useReviews(product.id)
  const [limit, setLimit] = useState(openByDefault ? 10 : 3)
  const brand = brandOf(product)
  const visible = reviews.slice(0, limit)

  return (
    <div className="border border-ink/10 bg-ivory p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 pb-4">
        <div className="flex items-center gap-3">
          <img src={product.image} alt="" className="h-14 w-11 shrink-0 object-cover" loading="lazy" />
          <div>
            <p className="text-[9.5px] uppercase tracking-[0.16em] text-goldDeep">{brand.name}</p>
            <p className="font-serif text-[19px] leading-tight">{product.name}</p>
          </div>
        </div>
        <div className="text-right">
          {stats.total === 0 ? (
            <p className="text-[11px] text-inkSoft">Aucun avis</p>
          ) : (
            <>
              <p className="font-serif text-2xl leading-none">
                {stats.reliable ? stats.average : '—'}
              </p>
              <p className="text-[10.5px] text-inkSoft">
                {stats.total} avis
              </p>
            </>
          )}
        </div>
      </div>

      {stats.total === 0 ? (
        <p className="py-6 text-center text-[12px] leading-relaxed text-inkSoft">
          Pas encore d’avis sur ce soin. Vous l’avez commandé ? Votre témoignage aidera les
          suivantes.
        </p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'positive', label: '4 et 5 ★' },
              { id: 'negative', label: '3 ★ et moins' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.06em] transition-colors ${
                  filter === item.id ? 'bg-ink text-ivory' : 'bg-cream text-inkSoft hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
            <span className="ml-auto text-[10px] uppercase tracking-[0.08em] text-inkSoft">Tri</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-full border border-ink/15 bg-ivory px-2.5 py-1 text-[10.5px] text-ink"
              aria-label="Trier les avis"
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {visible.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-inkSoft">
              Aucun avis dans cette catégorie.
            </p>
          ) : (
            <div className="mt-1">
              {visible.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {reviews.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((value) => value + 5)}
              className="mt-3 w-full rounded-full border border-ink/20 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              Afficher plus d’avis ({reviews.length - limit})
            </button>
          )}
        </>
      )}
    </div>
  )
}
