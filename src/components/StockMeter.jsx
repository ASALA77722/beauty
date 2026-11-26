import { stockLevel } from '../data/shop'

const TONES = {
  critique: 'bg-rose text-ivory',
  faible: 'bg-gold/20 text-goldDeep',
  ok: 'bg-sage/15 text-sage',
}

const BARS = {
  critique: 'bg-rose',
  faible: 'bg-goldDeep',
  ok: 'bg-sage',
}

/** Jauge de stock : crée l'urgence sans exagérer. */
export default function StockMeter({ product, compact = false }) {
  const level = stockLevel(product)
  const ratio = Math.max(0.06, Math.min(1, product.stock / (product.stockInitial || 40)))

  return (
    <div className={compact ? 'mt-1.5' : 'mt-3'}>
      <div className="flex items-center justify-between gap-2">
        <span className={`badge ${TONES[level.tone]}`}>{level.label}</span>
        {product.lead && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-goldDeep">
            Prix d'appel
          </span>
        )}
      </div>
      <div
        className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
        aria-label={`Stock restant : ${product.stock} sur ${product.stockInitial}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${BARS[level.tone]}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}
