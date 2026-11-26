import { PRICE_STATS } from '../data/shop'
import { FREE_SHIPPING_THRESHOLD } from '../lib/format'

const ITEMS = [
  'Produits achetés en circuit court',
  `${PRICE_STATS.average} % moins cher qu’en magasin`,
  `Livraison offerte dès ${FREE_SHIPPING_THRESHOLD} €`,
  'Paiement crypto −5 % (USDT, BTC, ETH)',
  'Paiement sécurisé en crypto',
  'Conseil beauté par e-mail',
]

function Track({ hidden = false }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 animate-marquee items-center pr-10">
      {ITEMS.map((item) => (
        <span
          key={item}
          className="flex shrink-0 items-center gap-10 pr-10 text-[10.5px] uppercase tracking-[0.22em] text-inkSoft"
        >
          {item}
          <span className="text-gold">✦</span>
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="flex overflow-hidden">
      <Track />
      <Track hidden />
    </div>
  )
}
