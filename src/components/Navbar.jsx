import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useScrolled } from '../hooks/useReveal'
import { FREE_SHIPPING_THRESHOLD } from '../lib/format'
import Icon from './Icon'
import { PRICE_STATS } from '../data/shop'

const LINKS = [
  { href: '#boutique', label: 'Boutique' },
  { href: '#offres', label: 'Offres' },
  { href: '#marques', label: 'Marques' },
  { href: '#avis', label: 'Avis' },
  { href: '#faq', label: 'Aide' },
]

export default function Navbar() {
  const { count, openCart } = useCart()
  const { user, displayName, openAuth, logout } = useAuth()
  const scrolled = useScrolled(40)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navHeight = scrolled ? 'h-16' : 'h-20'

  return (
    <>
      <div className="relative z-50 bg-forest text-cream">
        <div className="container-x flex h-9 items-center justify-center gap-2 overflow-hidden text-[10.5px] uppercase tracking-[0.2em] text-cream/85">
          <span className="hidden sm:inline">Livraison offerte dès {FREE_SHIPPING_THRESHOLD} €</span>
          <span className="hidden text-gold sm:inline">✦</span>
          <span className="font-semibold text-gold">
            −{PRICE_STATS.average} % vs prix magasin
          </span>
          <span className="hidden text-gold sm:inline">✦</span>
          <span className="hidden md:inline">Paiement crypto · USDT, BTC, ETH</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled ? 'border-b border-ink/10 bg-ivory/92 backdrop-blur-md' : 'bg-ivory'
        }`}
      >
        <nav
          className={`container-x flex items-center justify-between transition-all duration-500 ${navHeight}`}
          aria-label="Navigation principale"
        >
          <a href="#top" className="flex shrink-0 items-baseline gap-1.5">
            <span className="font-serif text-[27px] leading-none tracking-tight text-ink">Beauté</span>
            <span className="font-serif text-[27px] italic leading-none text-goldDeep">Paris</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="link-underline text-[11.5px] font-medium uppercase tracking-[0.16em] text-inkSoft transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <div className="group relative hidden sm:block">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-ink/15 px-3.5 py-2 text-[11.5px] font-medium text-ink transition-colors hover:border-goldDeep"
                  aria-haspopup="menu"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-[10px] font-semibold uppercase text-cream">
                    {displayName.slice(0, 1)}
                  </span>
                  <span className="max-w-[110px] truncate">
                    {user.firstName || 'Mon compte'}
                  </span>
                  <Icon name="chevron" className="h-3.5 w-3.5 text-inkSoft" />
                </button>
                <div className="invisible absolute right-0 top-full z-10 w-56 translate-y-1 rounded-xl border border-ink/10 bg-ivory p-2 opacity-0 shadow-soft transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <p className="px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-inkSoft">
                    Connectée
                  </p>
                  <p className="truncate px-3 pb-2 text-[13px] text-ink">{user.identifier}</p>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-ink transition-colors hover:bg-cream"
                  >
                    <Icon name="logout" className="h-4 w-4" /> Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuth()}
                className="hidden items-center gap-2 rounded-full px-3.5 py-2 text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:text-goldDeep sm:flex"
              >
                <Icon name="user" className="h-4 w-4" />
                Connexion
              </button>
            )}

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-cream"
              aria-label={`Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`}
            >
              <Icon name="bag" className="h-[21px] w-[21px]" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-goldDeep px-1 text-[10px] font-semibold text-ivory">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-cream lg:hidden"
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
            className="absolute inset-0 h-full w-full animate-fade-in bg-ink/50"
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

            {user ? (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-cream p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-sm font-semibold uppercase text-cream">
                  {displayName.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.firstName || 'Mon compte'}</p>
                  <p className="truncate text-[11px] text-inkSoft">{user.identifier}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="ml-auto text-[11px] uppercase tracking-[0.1em] text-goldDeep"
                >
                  Sortir
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  openAuth()
                }}
                className="btn-gold mt-6 w-full"
              >
                <Icon name="user" className="h-4 w-4" /> Se connecter
              </button>
            )}

            <ul className="mt-6 flex flex-col">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-ink/10 py-4 font-serif text-2xl text-ink"
                  >
                    {link.label}
                    <Icon name="arrow" className="h-4 w-4 text-goldDeep" />
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-auto pt-8 text-xs leading-relaxed text-inkSoft">
              Connexion par e-mail · code à 6 chiffres
              <br />
              Livraison offerte dès {FREE_SHIPPING_THRESHOLD} € · Retours 30 jours
            </p>
          </div>
        </div>
      )}
    </>
  )
}
