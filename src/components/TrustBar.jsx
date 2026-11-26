import Icon from './Icon'
import { SHOP } from '../config'
import { FREE_SHIPPING_THRESHOLD } from '../lib/format'

const ITEMS = [
  { icon: 'shield', title: 'Authenticité garantie', text: 'Sourcé chez les maisons' },
  { icon: 'truck', title: `Livraison offerte dès ${FREE_SHIPPING_THRESHOLD} €`, text: 'Expédié en 24 h' },
  { icon: 'coin', title: 'Paiement crypto −5 %', text: 'USDT, BTC ou ETH' },
  { icon: 'phone', title: `Conseil au ${SHOP.phone}`, text: SHOP.hours },
]

export default function TrustBar() {
  return (
    <section className="border-b border-ink/10 bg-cream/40">
      <div className="container-x grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-goldDeep">
              <Icon name={item.icon} className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px] font-medium leading-tight text-ink">{item.title}</p>
              <p className="mt-0.5 text-[10.5px] text-inkSoft">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
