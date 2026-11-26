import { useState } from 'react'
import Icon from './Icon'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus('error')
      return
    }
    setStatus('success')
    setEmail('')
  }

  return (
    <section className="relative overflow-hidden bg-clay py-16 text-ivory lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full border border-ivory/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 right-10 h-80 w-80 rounded-full border border-ivory/15"
      />

      <div className="container-x relative grid items-center gap-9 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest2 text-ivory/70">
            La lettre Lumière
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,2.9rem)] font-light leading-tight">
            −10 % sur votre premier rituel
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/80">
            Un e-mail par mois : nouveautés en avant-première, conseils de formulation et
            invitations à l'atelier. Pas de spam, promis.
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Votre adresse e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status !== 'idle') setStatus('idle')
              }}
              placeholder="votre@email.fr"
              className="w-full rounded-full border border-ivory/35 bg-transparent px-6 py-4 text-sm text-ivory placeholder:text-ivory/50 focus:border-ivory focus:outline-none"
              aria-invalid={status === 'error'}
              aria-describedby="newsletter-status"
            />
            <button
              type="submit"
              className="btn shrink-0 bg-ivory px-8 text-ink hover:bg-ink hover:text-ivory"
            >
              Je m'inscris
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </form>
          <p
            id="newsletter-status"
            aria-live="polite"
            className="mt-3 min-h-[18px] text-xs text-ivory/85"
          >
            {status === 'error' && "Merci de saisir une adresse e-mail valide."}
            {status === 'success' && '✦ Merci ! Votre code de bienvenue arrive dans votre boîte mail.'}
          </p>
        </div>
      </div>
    </section>
  )
}
