import { useEffect, useState } from 'react'
import { AUTO_OFFERS, FLASH_OFFER, PROMO_CODES } from '../data/shop'
import Icon from './Icon'
import { Reveal } from './Reveal'

function useCountdown(totalMinutes) {
  const [left, setLeft] = useState(totalMinutes * 60)
  useEffect(() => {
    const timer = setInterval(() => setLeft((value) => (value > 0 ? value - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [])
  const hours = Math.floor(left / 3600)
  const minutes = Math.floor((left % 3600) / 60)
  const seconds = left % 60
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(
    seconds,
  ).padStart(2, '0')}s`
}

function useCopyCode() {
  const [copied, setCopied] = useState(null)
  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* presse-papier indisponible : on affiche quand même la confirmation */
    }
    setCopied(code)
    setTimeout(() => setCopied(null), 1800)
  }
  return { copied, copyCode }
}

export default function Offers() {
  const { copied, copyCode } = useCopyCode()
  const countdown = useCountdown(FLASH_OFFER.endsInHours * 60)

  return (
    <section id="offres" className="scroll-mt-24 bg-forest py-16 text-cream lg:py-20">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-5 border-b border-cream/15 pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest2 text-gold">
              Offres du moment
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,4.4vw,3.2rem)] font-light leading-none">
              Trois façons de payer moins
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-cream/75">
                {FLASH_OFFER.label} — fin dans
              </p>
              <p className="mt-0.5 inline-flex items-baseline gap-1 rounded-lg bg-cream/10 px-2.5 py-1 font-serif text-2xl tabular-nums text-gold">
                {countdown}
              </p>
            </div>
            <span className="badge bg-gold px-3 py-1.5 text-ink">
              −{FLASH_OFFER.percent} % sur tout le site
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {AUTO_OFFERS.map((offer, index) => (
            <Reveal key={offer.id} delay={index * 80}>
              <div className="flex h-full flex-col rounded-xl border border-cream/20 bg-forestSoft/70 p-6 transition-colors hover:border-gold/60">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon name={index === 0 ? 'sparkle' : 'ticket'} className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-gold">
                  Automatique
                </p>
                <h3 className="mt-1 font-serif text-2xl text-cream">{offer.label}</h3>
                <p className="mt-1 text-[26px] font-medium leading-none text-gold">
                  −{offer.percent} %
                </p>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-cream/85">
                  {offer.description}. Appliqué d'office dans le panier, sans code à saisir.
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-cream/70">
                  Dès {offer.minQty} produits
                </p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={160}>
            <div className="flex h-full flex-col rounded-xl border border-gold/50 bg-gradient-to-br from-gold/25 to-forestSoft/60 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-ink">
                <Icon name="ticket" className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-gold">Avec code</p>
              <h3 className="mt-1 font-serif text-2xl text-cream">Codes cumulables</h3>
              <ul className="mt-2 flex-1 space-y-2.5">
                {Object.values(PROMO_CODES).map((promo) => (
                  <li key={promo.code}>
                    <button
                      type="button"
                      onClick={() => copyCode(promo.code)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg border border-cream/15 px-3 py-2 text-left transition-colors hover:border-gold/60"
                    >
                      <span className="text-[11.5px] leading-snug text-cream/80">
                        {promo.description}
                      </span>
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-gold">
                        {copied === promo.code ? 'Copié ✓' : promo.code}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex h-full flex-col border border-cream/15 bg-forestSoft/40 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                <Icon name="coin" className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-gold">Au paiement</p>
              <h3 className="mt-1 font-serif text-2xl text-cream">−5 % en crypto</h3>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-cream/85">
                Payez en USDT, BTC ou ETH et bénéficiez de 5 % de remise immédiate, automatiquement
                déduits dans le récapitulatif. L’adresse de dépôt est affichée au moment du paiement.
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-cream/70">
                Sans minimum d'achat
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
