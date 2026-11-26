import Icon from './Icon'
import Stars, { formatRating } from './Stars'

/** Bloc de synthèse : note moyenne, répartition par étoiles, recommandation. */
export default function RatingSummary({ stats, title = 'Avis clients' }) {
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
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${row.percent}%` }}
                />
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
      <p className="mt-3 flex items-center gap-1.5 text-[10.5px] text-inkSoft">
        <Icon name="shield" className="h-3.5 w-3.5 text-goldDeep" />
        {title} collectés après achat vérifié — nous ne supprimons pas les avis négatifs.
      </p>
    </div>
  )
}
