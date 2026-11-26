import { useState } from 'react'
import Icon from './Icon'
import Stars from './Stars'

const formatDate = (iso) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso),
  )

/** Carte d'avis cliquable : profil, note, texte, points positifs/négatifs, réponse boutique. */
export default function ReviewCard({ review, onHelpful, compact = false }) {
  const [expanded, setExpanded] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { customer } = review
  const long = review.body.length > 220
  const body = expanded || !long ? review.body : `${review.body.slice(0, 220).trimEnd()}…`

  return (
    <article className="border-b border-ink/10 py-5 last:border-b-0">
      <header className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setProfileOpen((value) => !value)}
          aria-expanded={profileOpen}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold uppercase tracking-wide transition-all ${
            profileOpen
              ? 'bg-goldDeep text-ivory ring-2 ring-gold ring-offset-2 ring-offset-ivory'
              : 'bg-forest text-cream hover:bg-forestSoft'
          }`}
          aria-label={`Voir le profil de ${customer.name}`}
          title={`${customer.name} · ${customer.city}`}
        >
          {customer.initials}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="text-[13px] font-medium text-ink hover:text-goldDeep"
            >
              {customer.name}
            </button>
            <span className="text-[11px] text-inkSoft">
              {customer.city} · {customer.reviewCount} avis
            </span>
            {review.orderRef && (
              <span className="badge bg-sage/15 px-2 py-0.5 text-[9.5px] text-sage">
                <Icon name="check" className="h-2.5 w-2.5" /> Achat vérifié
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Stars value={review.rating} className="h-3.5 w-3.5" />
            <span className="text-[11px] text-inkSoft">{formatDate(review.date)}</span>
            {customer.skin && (
              <span className="text-[10.5px] text-inkSoft/80">· {customer.skin}</span>
            )}
          </div>
        </div>
      </header>

      {profileOpen && (
        <div className="mt-3 animate-fade-in rounded-lg border border-gold/40 bg-cream/50 p-3.5 sm:ml-[52px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-serif text-[15px] text-ink">{customer.name}</p>
            <span className="text-[10px] uppercase tracking-[0.1em] text-goldDeep">
              Membre depuis {customer.memberSince}
            </span>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-inkSoft sm:grid-cols-3">
            <div>
              <dt className="text-[9.5px] uppercase tracking-[0.08em] text-inkSoft/70">Ville</dt>
              <dd className="text-ink">{customer.city}</dd>
            </div>
            <div>
              <dt className="text-[9.5px] uppercase tracking-[0.08em] text-inkSoft/70">Âge</dt>
              <dd className="text-ink">{customer.age} ans</dd>
            </div>
            <div>
              <dt className="text-[9.5px] uppercase tracking-[0.08em] text-inkSoft/70">Type de peau</dt>
              <dd className="text-ink">{customer.skin}</dd>
            </div>
            <div>
              <dt className="text-[9.5px] uppercase tracking-[0.08em] text-inkSoft/70">Avis publiés</dt>
              <dd className="text-ink">{customer.reviewCount}</dd>
            </div>
            <div>
              <dt className="text-[9.5px] uppercase tracking-[0.08em] text-inkSoft/70">Votes utiles reçus</dt>
              <dd className="text-ink">{customer.helpful}</dd>
            </div>
            <div>
              <dt className="text-[9.5px] uppercase tracking-[0.08em] text-inkSoft/70">Compte</dt>
              <dd className="text-ink">{customer.verified ? 'Vérifié' : 'Standard'}</dd>
            </div>
          </dl>
          {review.orderRef && (
            <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-sage">
              <Icon name="check" className="h-3 w-3" /> Commande {review.orderRef} · livrée et
              confirmée
            </p>
          )}
        </div>
      )}

      <div className="mt-3 pl-0 sm:pl-[52px]">
        <h4 className="font-serif text-[17px] leading-snug text-ink">{review.title}</h4>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-inkSoft">{body}</p>
        {long && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-goldDeep hover:underline"
          >
            {expanded ? 'Réduire' : 'Lire la suite'}
          </button>
        )}

        {(review.pros?.length > 0 || review.cons?.length > 0) && !compact && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {review.pros?.length > 0 && (
              <ul className="space-y-1">
                {review.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-1.5 text-[11.5px] text-ink">
                    <Icon name="check" className="mt-0.5 h-3 w-3 shrink-0 text-sage" />
                    {pro}
                  </li>
                ))}
              </ul>
            )}
            {review.cons?.length > 0 && (
              <ul className="space-y-1">
                {review.cons.map((con) => (
                  <li key={con} className="flex items-start gap-1.5 text-[11.5px] text-inkSoft">
                    <Icon name="close" className="mt-1 h-2.5 w-2.5 shrink-0 text-rose" />
                    {con}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {review.reply && (
          <div className="mt-3 rounded-lg border-l-2 border-gold bg-cream/60 px-3.5 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-goldDeep">
              Réponse de Beauté Paris
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-inkSoft">{review.reply}</p>
          </div>
        )}

        <footer className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={() => onHelpful?.(review.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
              review.markedHelpful
                ? 'border-goldDeep bg-gold/15 text-goldDeep'
                : 'border-ink/15 text-inkSoft hover:border-goldDeep hover:text-goldDeep'
            }`}
            aria-pressed={review.markedHelpful}
          >
            <Icon name="check" className="h-3 w-3" />
            Utile ({review.helpfulCount})
          </button>

          {review.wouldRecommend === true && (
            <span className="text-[11px] text-sage">Recommande ce produit</span>
          )}
          {review.wouldRecommend === false && (
            <span className="text-[11px] text-rose">Ne le recommande pas</span>
          )}
          {review.wouldRecommend === null && (
            <span className="text-[11px] text-inkSoft">Mitigée — ne se prononce pas encore</span>
          )}
        </footer>
      </div>
    </article>
  )
}
