import Icon from './Icon'

const ITEMS = [
  { icon: 'shield', title: 'Authenticité garantie', text: 'Sourcé chez les maisons' },
  { icon: 'truck', title: 'Livraison offerte dès 60 €', text: 'Expédié en 24 h' },
  { icon: 'card', title: 'Paiement en 3× sans frais', text: 'CB, TWINT, virement −5 %' },
  { icon: 'phone', title: 'Conseil au 01 84 80 12 34', text: 'Lun–sam, 9 h–19 h' },
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
