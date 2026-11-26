import { availability } from '../data/shop'
import Icon from './Icon'

const TONES = {
  critique: 'bg-rose/15 text-rose',
  ok: 'bg-sage/15 text-sage',
}

/** Disponibilité du produit : en stock ou épuisé, sans chiffre inventé. */
export default function StockMeter({ product, compact = false }) {
  const state = availability(product)

  return (
    <div className={compact ? 'mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1' : 'mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1'}>
      <span className={`badge ${TONES[state.tone]} px-2 py-0.5 text-[9.5px]`}>
        <Icon name={state.tone === 'ok' ? 'check' : 'clock'} className="h-2.5 w-2.5" />
        {state.label}
      </span>
      <span className="text-[10px] text-inkSoft">{state.detail}</span>
    </div>
  )
}
