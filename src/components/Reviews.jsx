import { useMemo, useState } from 'react'
import { PRODUCTS, brandOf } from '../data/shop'
import { getAllReviewsStats, useReviews } from '../hooks/useReviews'
import { CUSTOMERS } from '../data/reviews'
import Icon from './Icon'
import RatingSummary from './RatingSummary'
import ReviewCard from './ReviewCard'
import Stars, { formatRating } from './Stars'

const FILTERS = [
  { id: 'all', label: 'Tous les avis' },
  { id: 'positive', label: '4 et 5 étoiles' },
  { id: 'negative', label: '3 étoiles et moins' },
]

export default function Reviews() {
  const [productFilter, setProductFilter] = useState('all')
  const globalStats = useMemo(() => getAllReviewsStats(), [])

  return (
    <section id="avis" className="scroll-mt-24 bg-cream/40 py-16 lg:py-24">
      <div className="container-x">
        <div className="text-center">
          <p className="eyebrow">Avis clients</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-[clamp(1.9rem,4vw,3rem)] font-light leading-tight">
            Ce qu'elles pensent vraiment,
            <br />
            <span className="italic text-goldDeep">sans filtre</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed text-inkSoft">
            Les {globalStats.total} avis les plus récents, tous liés à une commande vérifiée — y
            compris les critiques. Aucune note n'est retouchée, les avis négatifs restent en ligne.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Stars value={globalStats.average} className="h-4 w-4" />
            <span className="text-[13px] font-medium text-ink">{formatRating(globalStats.average)}/5</span>
            <span className="text-[11px] text-inkSoft">
              · {globalStats.recommendPercent} % recommandent
            </span>
          </div>
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
                <Icon name="user" className="h-4 w-4 text-goldDeep" />
                {CUSTOMERS.length} clientes ont laissé un avis
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-inkSoft">
                Chaque avis est publié depuis un compte client vérifié : commande, numéro de lot et
                date de livraison contrôlés. Cliquez sur une « pastille » pour voir le profil du
                membre, sur « Utile » pour voter.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  'Peaux sèches',
                  'Peaux mixtes',
                  'Peaux sensibles',
                  '40 ans et +',
                  'Taches',
                  'Rides',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] text-inkSoft"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
    </section>
  )
}

/** Liste d'avis d'un produit, avec filtres et pagination. */
function ProductReviewsBlock({ product, openByDefault = false }) {
  const { reviews, stats, filter, setFilter, toggleHelpful } = useReviews(product.id)
  const [limit, setLimit] = useState(openByDefault ? 10 : 3)
  const brand = brandOf(product)
  const visible = reviews.slice(0, limit)

  return (
    <div className="border border-ink/10 bg-ivory p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt=""
            className="h-14 w-11 shrink-0 object-cover"
            loading="lazy"
          />
          <div>
            <p className="text-[9.5px] uppercase tracking-[0.16em] text-goldDeep">{brand.name}</p>
            <p className="font-serif text-[19px] leading-tight">{product.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-serif text-2xl leading-none">{formatRating(stats.average)}</p>
          <Stars value={stats.average} className="mt-1 h-3 w-3" />
          <p className="text-[10.5px] text-inkSoft">{stats.total} avis</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.06em] transition-colors ${
              filter === item.id
                ? 'bg-ink text-ivory'
                : 'bg-cream text-inkSoft hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-6 text-center text-[12px] text-inkSoft">
          Aucun avis dans cette catégorie pour ce produit — c'est plutôt bon signe.
        </p>
      ) : (
        <div className="mt-1">
          {visible.map((review) => (
            <ReviewCard key={review.id} review={review} onHelpful={toggleHelpful} />
          ))}
        </div>
      )}

      {reviews.length > limit && (
        <button
          type="button"
          onClick={() => setLimit((value) => value + 5)}
          className="mt-3 w-full rounded-full border border-ink/20 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-ivory"
        >
          Afficher plus d'avis ({reviews.length - limit})
        </button>
      )}
    </div>
  )
}
