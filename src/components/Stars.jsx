import Icon from './Icon'

/** 4.2 -> "4,2" (virgule décimale française). */
export const formatRating = (value) => Number(value).toFixed(1).replace('.', ',')

/**
 * Affichage d'une note en étoiles.
 * `interactive` rend les étoiles cliquables (sélection d'une note).
 */
export default function Stars({
  value = 5,
  className = 'h-3.5 w-3.5',
  showValue = false,
  count,
  interactive = false,
  onChange,
  label,
}) {
  if (interactive) {
    return (
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label || 'Note'}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
            onClick={() => onChange?.(star)}
            className="rounded p-0.5 transition-transform hover:scale-110"
          >
            <Icon
              name="star"
              className={`h-7 w-7 ${star <= value ? 'fill-gold text-gold' : 'fill-transparent text-ink/25'}`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex gap-0.5 text-gold">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon
            key={index}
            name="star"
            className={`${className} ${
              index < Math.round(value) ? 'fill-gold text-gold' : 'fill-transparent text-ink/25'
            }`}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-[11px] font-medium text-ink">{formatRating(value)}</span>
      )}
      {count != null && <span className="text-[11px] text-inkSoft">({count})</span>}
    </span>
  )
}
