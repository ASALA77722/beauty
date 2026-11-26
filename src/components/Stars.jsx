import Icon from './Icon'

export default function Stars({ value = 5, className = 'h-3.5 w-3.5', showValue = false, count }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex gap-0.5 text-gold">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon
            key={index}
            name="star"
            className={`${className} ${index < Math.round(value) ? 'fill-gold/30' : 'text-ink/20'}`}
          />
        ))}
      </span>
      {showValue && <span className="text-[11px] font-medium text-ink">{value}</span>}
      {count != null && <span className="text-[11px] text-inkSoft">({count})</span>}
    </span>
  )
}
