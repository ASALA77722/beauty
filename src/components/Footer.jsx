import Icon from './Icon'

const COLUMNS = [
  {
    title: 'Boutique',
    links: ['Visage', 'Corps', 'Coffrets', 'Recharges', 'Cartes cadeaux'],
  },
  {
    title: 'La maison',
    links: ['Notre histoire', 'Ingrédients', 'Engagements', 'Atelier de Grasse', 'Journal'],
  },
  {
    title: 'Aide',
    links: ['Livraison & retours', 'Nous contacter', 'FAQ', 'Programme fidélité', 'Points de vente'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink pt-16 text-ivory/70">
      <div className="container-x">
        <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-baseline gap-2">
              <span className="font-serif text-3xl leading-none text-ivory">Maison</span>
              <span className="font-serif text-3xl italic leading-none text-clay">Lumière</span>
            </a>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed">
              Cosmétiques naturels formulés et fabriqués à Grasse. Des formules courtes pour une
              beauté qui prend son temps.
            </p>
            <div className="mt-6 flex gap-2">
              {['instagram', 'heart'].map((icon) => (
                <a
                  key={icon}
                  href="#top"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-ivory hover:text-ivory"
                  aria-label={icon === 'instagram' ? 'Instagram' : 'Nos coups de cœur'}
                >
                  <Icon name={icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-ivory">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => {
                  const href =
                    link === 'Ingrédients' || link === 'Engagements'
                      ? '#engagements'
                      : link === 'Notre histoire' || link === 'Atelier de Grasse'
                        ? '#maison'
                        : link === 'FAQ' || link === 'Livraison & retours'
                          ? '#faq'
                          : link === 'Avis'
                            ? '#avis'
                            : '#boutique'
                  return (
                    <li key={link}>
                      <a href={href} className="text-[13px] transition-colors hover:text-ivory">
                        {link}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-ivory/15 py-6 text-[11px] uppercase tracking-[0.12em] md:flex-row">
          <p>© {new Date().getFullYear()} Maison Lumière · Atelier de Grasse, France</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {['Mentions légales', 'CGV', 'Confidentialité', 'Cookies'].map((item) => (
              <li key={item}>
                <a href="#top" className="transition-colors hover:text-ivory">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
