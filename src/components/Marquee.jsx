const ITEMS = [
  'Produits 100 % authentiques',
  '−30 % en moyenne vs magasin',
  'Livraison offerte dès 60 €',
  'Paiement en 3× sans frais',
  'Échantillons offerts',
  'Conseil beauté par téléphone',
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
