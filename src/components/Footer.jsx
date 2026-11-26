import Icon from './Icon'

const COLUMNS = [
  {
    title: 'Boutique',
    links: [
      ['Sérums', '#boutique'],
      ['Soins visage', '#boutique'],
      ['Jeanne Piaubert', '#boutique'],
      ['Stendhal', '#boutique'],
      ['Biarritz', '#boutique'],
    ],
  },
  {
    title: 'Offres',
    links: [
      ['Offres automatiques', '#offres'],
      ['Codes promo', '#offres'],
      ['Paiement crypto', '#offres'],
      ['−5 % en crypto', '#offres'],
      ['Newsletter', '#compte'],
    ],
  },
  {
    title: 'Aide',
    links: [
      ['Créer mon compte', '#compte'],
      ['Suivre ma commande', '#suivi'],
      ['Livraison & retours', '#faq'],
      ['Authenticité', '#faq'],
      ['Nous contacter', 'mailto:bonjour@beaute-paris.fr'],
      ['FAQ', '#faq'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink pt-14 text-cream/70">
      <div className="container-x">
        <div className="grid gap-10 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-baseline gap-1.5">
              <span className="font-serif text-3xl leading-none text-cream">Beauté</span>
              <span className="font-serif text-3xl italic leading-none text-gold">Paris</span>
            </a>
            <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed">
              Parfumerie beauté en ligne. Soins authentiques des grandes maisons françaises, à prix
              juste et en toute transparence.
            </p>
            <div className="mt-5 flex gap-2">
              {['instagram', 'heart', 'bell'].map((icon) => (
                <a
                  key={icon}
                  href="#top"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold"
                  aria-label={icon}
                >
                  <Icon name={icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-cream/45">
              Service client : 01 84 80 12 34
              <br />
              Lun–sam, 9 h–19 h · 12 rue de la Paix, 75002 Paris
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-cream">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-[12.5px] transition-colors hover:text-cream">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream/15 py-5 text-[10.5px] uppercase tracking-[0.1em] text-cream/50 md:flex-row">
          <p>© {new Date().getFullYear()} Beauté Paris · Tous droits réservés</p>
          <a
            href="#vendeur"
            className="text-[10px] uppercase tracking-[0.14em] text-gold/70 transition-colors hover:text-gold"
          >
            Espace vendeur
          </a>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {['Mentions légales', 'CGV', 'Confidentialité', 'Cookies'].map((item) => (
              <li key={item}>
                <a href="#faq" className="transition-colors hover:text-cream">
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
