import { useEffect, useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useScrolled } from '../hooks/useReveal'
import Icon from './Icon'

const LINKS = [
  { href: '#boutique', label: 'Boutique' },
  { href: '#rituel', label: 'Le rituel' },
  { href: '#maison', label: 'La maison' },
  { href: '#avis', label: 'Avis' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const { count, openCart } = useCart()
  const scrolled = useScrolled(40)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <div className="relative z-50 bg-ink text-ivory">
        <div className="container-x flex h-9 items-center justify-center overflow-hidden text-[10.5px] uppercase tracking-[0.22em] text-ivory/80">
          <span className="hidden sm:inline">Livraison offerte dès 60 € ·</span>
          <span className="mx-2 hidden sm:inline">·</span>
          <span>Formules naturelles fabriquées à Grasse</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'border-b border-ink/10 bg-ivory/90 backdrop-blur-md'
            : 'border-b border-transparent bg-ivory'
        }`}
      >
        <nav
          className={`container-x flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
          aria-label="Navigation principale"
        >
          <a href="#top" className="group flex items-baseline gap-2">
            <span className="font-serif text-[26px] leading-none tracking-tight text-ink">
              Maison
            </span>
            <span className="font-serif text-[26px] italic leading-none text-clay">Lumière</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="link-underline text-[12px] font-medium uppercase tracking-[0.16em] text-inkSoft transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 sm:gap-3">

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand"
              aria-label={`Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`}
            >
              <Icon name="bag" className="h-[21px] w-[21px]" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-ivory">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Icon name="menu" className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 h-full w-full bg-ink/40 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-ivory p-6 shadow-soft animate-slide-in">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15"
                aria-label="Fermer le menu"
              >
                <Icon name="close" />
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-1">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-ink/10 py-4 font-serif text-2xl text-ink"
                  >
                    {link.label}
                    <Icon name="arrow" className="h-4 w-4 text-clay" />
                  </a>
                </li>
              ))}
            </ul>
            <a href="#boutique" onClick={() => setMobileOpen(false)} className="btn-dark mt-8 w-full">
              Découvrir la boutique
            </a>
            <p className="mt-auto pt-8 text-xs leading-relaxed text-inkSoft">
              Livraison offerte dès 60 € · Retours 30 jours
              <br />
              Atelier de Grasse, France
            </p>
          </div>
        </div>
      )}
    </>
  )
}
