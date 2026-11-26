import { useState } from 'react'
import { DONATION_COMMITMENT, DONATIONS, donationsReady, PAYOUT, payoutLink, SHOP } from '../config'
import { euro } from '../lib/format'
import Icon from './Icon'


/**
 * Dons solidaires. Rien n'est affiché si aucun projet réel n'est décrit :
 * un don ne se promet pas avec un nom inventé.
 */
export default function Donations() {
  const ready = donationsReady()

  if (!ready) {
    return (
      <section id="dons" className="scroll-mt-24 bg-ivory py-16 lg:py-20">
        <div className="container-x">
          <div className="rounded-2xl border border-ink/12 bg-cream/60 p-6 sm:p-8">
            <p className="text-[11px] font-medium uppercase tracking-widest2 text-goldDeep">
              Solidarité
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.6rem,3.4vw,2.3rem)] font-light leading-tight text-ink">
              Notre programme solidaire s&apos;installe
            </h2>
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-inkSoft">
              Nous n&apos;ouvrons les dons qu&apos;une fois le projet réellement choisi, l&apos;association
              d&apos;accord et la réception des fonds en place. Aucun don n&apos;est encaissé d&apos;ici là :
              nous préférons une page vide à une promesse que nous ne pourrions pas tenir.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return <DonationPanel />
}

function DonationPanel() {
  const [amount, setAmount] = useState(DONATIONS.presets[2] ?? 25)
  const [custom, setCustom] = useState('')
  const [donor, setDonor] = useState('')

  const value = custom ? Math.max(0, Number(custom.replace(',', '.')) || 0) : amount

  return (
    <section id="dons" className="scroll-mt-24 bg-ivory py-16 lg:py-20">
      <div className="container-x">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest2 text-goldDeep">
              <Icon name="heart" className="h-3.5 w-3.5" /> Solidarité
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.9rem,4vw,2.9rem)] font-light leading-tight text-ink">
              {DONATIONS.projectName}
            </h2>
            <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-inkSoft">
              {DONATIONS.purpose}
            </p>

            <ul className="mt-6 space-y-2.5 text-[12.5px] leading-relaxed text-inkSoft">
              <li className="flex items-start gap-2.5">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                Don unique, à partir de 5 €, sans abonnement ni engagement.
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                {DONATION_COMMITMENT}
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                {DONATIONS.taxReceipt
                  ? 'Reçu fiscal délivré par l’organisme bénéficiaire.'
                  : 'Aucun reçu fiscal : une boutique ne peut pas en délivrer. Nous ne le promettons donc pas.'}
              </li>
              {DONATIONS.transparencyUrl && (
                <li className="flex items-start gap-2.5">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  <a
                    href={DONATIONS.transparencyUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-goldDeep/40 underline-offset-2 hover:text-ink"
                  >
                    Voir les montants collectés et reversés
                  </a>
                </li>
              )}
            </ul>

            <p className="mt-6 max-w-xl border-l-2 border-goldDeep/30 pl-4 text-[12.5px] italic leading-relaxed text-inkSoft">
              « Chaque geste compte. Ce que nous recevons ici ne passe pas par notre caisse : il va
              directement au projet, et nous publions ce que nous avons versé. »
            </p>
          </div>

          <div className="rounded-2xl border border-ink/12 bg-cream/60 p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-goldDeep">
              1 · Votre montant
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {DONATIONS.presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset)
                    setCustom('')
                  }}
                  aria-pressed={!custom && amount === preset}
                  className={`rounded-xl border px-2 py-2.5 text-[13px] font-medium transition-colors ${
                    !custom && amount === preset
                      ? 'border-goldDeep bg-gold/10 text-ink'
                      : 'border-ink/15 text-inkSoft hover:bg-ivory'
                  }`}
                >
                  {preset} €
                </button>
              ))}
            </div>
            <label
              htmlFor="don-libre"
              className="mt-3 block text-[10.5px] uppercase tracking-[0.12em] text-inkSoft"
            >
              Ou un montant libre
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-ink/15 bg-ivory px-3 py-2">
              <input
                id="don-libre"
                inputMode="decimal"
                value={custom}
                onChange={(event) => setCustom(event.target.value.replace(/[^\d.,]/g, ''))}
                placeholder="Montant en euros"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-inkSoft/60"
              />
              <span className="text-[13px] text-inkSoft">€</span>
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-goldDeep">
              2 · Votre prénom (facultatif)
            </p>
            <input
              value={donor}
              onChange={(event) => setDonor(event.target.value)}
              placeholder="Pour figurer sur nos remerciements"
              className="mt-1 w-full rounded-xl border border-ink/15 bg-ivory px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkSoft/60"
            />

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-goldDeep">
              3 · Verser {value > 0 ? euro(value) : '—'}
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-inkSoft">
              Votre don se règle sur la page sécurisée de notre prestataire, au nom de{' '}
              <span className="font-medium text-ink">{SHOP.name}</span>. Aucune coordonnée de paiement
              n’est affichée ici — vous ne partagez rien que vous ne choisissiez.
            </p>
            {payoutLink(value) ? (
              <a
                href={payoutLink(value)}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-gold mt-3 w-full justify-center"
              >
                <Icon name="heart" className="h-4 w-4" /> Faire un don de {euro(value)}
              </a>
            ) : (
              <p className="mt-3 rounded-xl border border-ink/15 bg-ivory px-3 py-2.5 text-[11.5px] leading-relaxed text-inkSoft">
                Le don en ligne est en cours d’activation. Écrivez-nous à{' '}
                <a href={`mailto:${SHOP.email}`} className="underline">
                  {SHOP.email}
                </a>{' '}
                : nous vous transmettons le lien personnel de votre don.
              </p>
            )}

            <a
              href={`mailto:${SHOP.email}?subject=${encodeURIComponent(
                `Don${donor ? ` de ${donor}` : ''} de ${value} €`,
              )}&body=${encodeURIComponent(
                `Bonjour,\n\nJ’ai versé un don de ${value} €${donor ? ` (${donor})` : ''}.\nHash de transaction : \n\nMerci de me le confirmer.`,
              )}`}
              className="btn mt-4 w-full justify-center border border-forest/25 text-forest hover:bg-forest hover:text-cream"
            >
              <Icon name="mail" className="h-4 w-4" /> M’envoyer une confirmation par e-mail
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
