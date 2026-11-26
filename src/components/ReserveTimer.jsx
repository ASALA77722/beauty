import { useEffect, useState } from 'react'
import Icon from './Icon'

/**
 * Minuteur du panier.
 * Il n'y a pas de stock réel « bloqué » côté serveur : ce minuteur rappelle
 * simplement que les prix et les disponibilités peuvent évoluer.
 */
export default function ReserveTimer({ until, tone = 'light' }) {
  const [left, setLeft] = useState(() => Math.max(0, until - Date.now()))

  useEffect(() => {
    setLeft(Math.max(0, until - Date.now()))
    const timer = setInterval(() => setLeft(Math.max(0, until - Date.now())), 1000)
    return () => clearInterval(timer)
  }, [until])

  const minutes = Math.floor(left / 60000)
  const seconds = Math.floor((left % 60000) / 1000)
  const expired = left <= 0

  const base =
    tone === 'dark'
      ? 'bg-cream/10 text-cream'
      : expired
        ? 'bg-cream text-inkSoft'
        : 'bg-sage/10 text-sage'

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] ${base}`}>
      <Icon name="clock" className="h-3.5 w-3.5 shrink-0" />
      {expired ? (
        <span>Panier conservé sur cet appareil. Les prix sont revérifiés au paiement.</span>
      ) : (
        <span>
          Prix vérifiés à l’instant · panier conservé{' '}
          <strong className="font-semibold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </strong>
        </span>
      )}
    </div>
  )
}
