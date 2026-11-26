const ITEMS = [
  'Certifié Ecocert',
  'Fabriqué à Grasse',
  'Vegan & sans cruauté',
  'Emballages rechargeables',
  'Formules courtes',
  'Testé dermatologiquement',
]

function Track({ hidden = false }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center animate-marquee pr-10"
    >
      {ITEMS.map((item) => (
        <span
          key={item}
          className="flex shrink-0 items-center gap-10 pr-10 text-[11px] uppercase tracking-[0.22em] text-inkSoft"
        >
          {item}
          <span className="text-clay">✦</span>
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
