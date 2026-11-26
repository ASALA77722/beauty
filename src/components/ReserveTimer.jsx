import { useEffect, useState } from 'react'
import Icon from './Icon'

/** Compte à rebours de réservation (prix + stocks) affiché dans le panier. */
export default function ReserveTimer({ until, tone = 'light' }) {
  const [left, setLeft] = useState(() => Math.max(0, until - Date.now()))

  useEffect(() => {
    const timer = setInterval(() => setLeft(Math.max(0, until - Date.now())), 1000)
    return () => clearInterval(timer)
  }, [until])

  const minutes = Math.floor(left / 60000)
  const seconds = Math.floor((left % 60000) / 1000)
  const expired = left <= 0
  const urgent = left <= 120000

  const base =
    tone === 'dark'
      ? 'bg-cream/10 text-cream'
      : urgent
        ? 'bg-rose/10 text-rose'
        : 'bg-sage/10 text-sage'

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] ${base}`}>
      <Icon name="lock" className="h-3.5 w-3.5 shrink-0" />
      {expired ? (
        <span>Réservation expirée — les prix peuvent avoir changé.</span>
      ) : (
        <span>
          Prix et stocks réservés pendant{' '}
          <strong className="font-semibold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </strong>
          {urgent ? ' — plus que quelques minutes !' : ''}
        </span>
      )}
    </div>
  )
}
