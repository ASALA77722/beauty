import Stars, { formatRating } from './Stars'

/** Synthèse des notes — n'affiche une moyenne qu'à partir de 3 avis réels. */
export default function RatingSummary({ stats, title = 'Avis clients' }) {
  if (!stats.total) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-cream/40 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-inkSoft">{title}</p>
        <p className="mt-2 font-serif text-[19px] leading-snug text-ink">Pas encore d’avis</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-inkSoft">
          Aucun avis n’a encore été déposé. Dès la première commande livrée, vous pourrez donner le
          vôtre — et il sera publié tel quel.
        </p>
      </div>
    )
  }

  if (!stats.reliable) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-cream/40 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-inkSoft">{title}</p>
        <div className="mt-2 flex items-center gap-2">
          <Stars value={stats.average} className="h-4 w-4" />
          <span className="text-[12px] text-inkSoft">
            {stats.total} avis · moyenne affichée dès 3 avis
          </span>
        </div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-inkSoft">
          Trop peu d’avis pour une moyenne fiable. Les témoignages sont publiés ci-dessous, sans
          note globale.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-cream/40 p-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div>
          <p className="font-serif text-[44px] leading-none text-ink">{formatRating(stats.average)}</p>
          <Stars value={stats.average} className="mt-1.5 h-4 w-4" />
          <p className="mt-1 text-[11px] text-inkSoft">
            {stats.total} avis · {stats.verified} vérifiés
          </p>
        </div>

        <div className="min-w-[180px] flex-1 space-y-1">
          {stats.rows.map((row) => (
            <div key={row.star} className="flex items-center gap-2">
              <span className="w-8 text-[10.5px] tabular-nums text-inkSoft">{row.star} ★</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-gold" style={{ width: `${row.percent}%` }} />
              </div>
              <span className="w-9 text-right text-[10.5px] tabular-nums text-inkSoft">
                {row.count}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-ivory px-4 py-3 text-center">
          <p className="font-serif text-2xl text-sage">{stats.recommendPercent} %</p>
          <p className="mt-0.5 max-w-[110px] text-[10px] uppercase leading-snug tracking-[0.1em] text-inkSoft">
            recommandent ce produit
          </p>
        </div>
      </div>
    </div>
  )
}
