import { useState } from 'react'
import Icon from './Icon'
import Stars from './Stars'

const formatDate = (iso) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso),
  )

/** Avis réel d'une cliente : contenu, note, achat vérifié, réponse éventuelle. */
export default function ReviewCard({ review, compact = false }) {
  const [expanded, setExpanded] = useState(false)
  const long = review.body.length > 260
  const body = expanded || !long ? review.body : `${review.body.slice(0, 260).trimEnd()}…`

  return (
    <article className="border-b border-ink/10 py-5 last:border-b-0">
      <header className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-[12px] font-semibold uppercase tracking-wide text-cream">
          {review.initials}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[13px] font-medium text-ink">{review.author}</p>
            {review.city && <span className="text-[11px] text-inkSoft">{review.city}</span>}
            {review.orderRef && (
              <span className="badge bg-sage/15 px-2 py-0.5 text-[9.5px] text-sage">
                <Icon name="check" className="h-2.5 w-2.5" /> Achat vérifié
              </span>
            )}
            {!review.orderRef && (
              <span className="badge bg-cream px-2 py-0.5 text-[9.5px] text-inkSoft">Client</span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Stars value={review.rating} className="h-3.5 w-3.5" />
            <span className="text-[11px] text-inkSoft">{formatDate(review.date)}</span>
          </div>
        </div>
      </header>

      <div className="mt-3 sm:pl-[52px]">
        {review.title && (
          <h4 className="font-serif text-[17px] leading-snug text-ink">{review.title}</h4>
        )}
        <p className="mt-1.5 whitespace-pre-wrap text-[12.5px] leading-relaxed text-inkSoft">{body}</p>
        {long && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-goldDeep hover:underline"
          >
            {expanded ? 'Réduire' : 'Lire la suite'}
          </button>
        )}

        {(review.photos ?? []).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {review.photos.map((src, index) => (
              <img
                key={src.slice(-24) + index}
                src={src}
                alt=""
                className="h-20 w-20 rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {review.reply && (
          <div className="mt-3 rounded-lg border-l-2 border-gold bg-cream/60 px-3.5 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-goldDeep">
              Réponse de la boutique
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-inkSoft">{review.reply}</p>
          </div>
        )}

        {!compact && review.wouldRecommend === false && (
          <p className="mt-2 text-[11px] text-rose">Ne recommande pas ce produit</p>
        )}
      </div>
    </article>
  )
}
