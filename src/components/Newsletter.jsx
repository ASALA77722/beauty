import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { isEmail, isPhone } from '../lib/format'
import Icon from './Icon'

export default function Newsletter() {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle')
  const { openAuth } = useAuth()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isEmail(value) && !isPhone(value)) {
      setStatus('error')
      return
    }
    setStatus('success')
    setValue('')
  }

  return (
    <section id="compte" className="scroll-mt-24 bg-forest py-16 text-cream lg:py-20">
      <div className="container-x grid items-center gap-9 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest2 text-gold">
            Espace client
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.9rem,4vw,2.9rem)] font-light leading-tight">
            Un compte, deux façons de se connecter
          </h2>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-cream/75">
            E-mail ou numéro de téléphone, à votre convenance. Suivi de commande, historique,
            échantillons choisis et offres privées — sans mot de passe à retenir.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => openAuth()} className="btn-gold">
              <Icon name="mail" className="h-4 w-4" /> Se connecter par e-mail
            </button>
            <button type="button" onClick={() => openAuth()} className="btn border border-cream/30 text-cream hover:bg-cream hover:text-ink">
              <Icon name="phone" className="h-4 w-4" /> Par téléphone
            </button>
          </div>
          <p className="mt-3 text-[10.5px] uppercase tracking-[0.12em] text-cream/45">
            Code à 6 chiffres · achat invité impossible par sécurité
          </p>
        </div>

        <div className="rounded-2xl border border-cream/15 bg-forestSoft/40 p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
            −10 % sur votre 1ʳᵉ commande
          </p>
          <p className="mt-2 font-serif text-2xl leading-tight">Recevez le code BIENVENUE10</p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5 sm:flex-row" noValidate>
            <label htmlFor="nl-value" className="sr-only">
              Votre e-mail ou numéro de téléphone
            </label>
            <input
              id="nl-value"
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                if (status !== 'idle') setStatus('idle')
              }}
              placeholder="vous@email.fr ou 06 12 34 56 78"
              className="w-full rounded-full border border-cream/30 bg-transparent px-5 py-3.5 text-sm text-cream placeholder:text-cream/45 focus:border-gold focus:outline-none"
              aria-invalid={status === 'error'}
              aria-describedby="nl-status"
            />
            <button type="submit" className="btn shrink-0 bg-cream px-6 text-ink hover:bg-gold">
              Recevoir
            </button>
          </form>
          <p id="nl-status" aria-live="polite" className="mt-2.5 min-h-[18px] text-[11.5px] text-cream/80">
            {status === 'error' && 'Indiquez un e-mail ou un numéro de téléphone valide.'}
            {status === 'success' && '✦ Merci ! Votre code BIENVENUE10 arrive par e-mail.'}
          </p>
        </div>
      </div>
    </section>
  )
}
