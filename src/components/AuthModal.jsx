import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Icon from './Icon'

const STEPS = {
  identify: { title: 'Se connecter', subtitle: 'Un code à 6 chiffres, envoyé par e-mail.' },
  code: { title: 'Vérification', subtitle: 'Saisissez le code reçu dans votre boîte mail.' },
  profile: { title: 'Bienvenue', subtitle: 'Deux informations et c’est terminé.' },
}

export default function AuthModal() {
  const {
    isOpen,
    closeAuth,
    step,
    identifier,
    setIdentifier,
    error,
    requestCode,
    verifyCode,
    completeProfile,
    sending,
    masked,
    shopEmail,
    setStep,
  } = useAuth()

  const [code, setCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [newsletter, setNewsletter] = useState(true)

  useEffect(() => {
    if (!isOpen) {
      setCode('')
      setFirstName('')
      setLastName('')
      setPhone('')
    }
  }, [isOpen])

  useEffect(() => {
    if (step !== 'code') setCode('')
  }, [step])

  if (!isOpen) return null

  const meta = STEPS[step] ?? STEPS.identify

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink/55" onClick={closeAuth} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connexion à votre compte"
        className="relative z-10 w-full max-w-md animate-fade-up overflow-hidden bg-ivory shadow-soft sm:rounded-2xl"
      >
        <div className="relative bg-forest px-7 pb-7 pt-6 text-cream">
          <button
            type="button"
            onClick={closeAuth}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            aria-label="Fermer"
          >
            <Icon name="close" />
          </button>
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold">
            Beauté Paris · Espace client
          </p>
          <h2 className="mt-2 font-serif text-3xl leading-tight">{meta.title}</h2>
          <p className="mt-1.5 text-[13px] text-cream/70">{meta.subtitle}</p>
        </div>

        <div className="p-7">
          {error && (
            <p className="mb-4 rounded-lg bg-rose/10 px-3 py-2 text-[12.5px] text-rose" role="alert">
              {error}
            </p>
          )}

          {step === 'identify' && (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                requestCode()
              }}
              noValidate
            >
              <label htmlFor="auth-identifier" className="text-[11px] font-medium uppercase tracking-[0.14em] text-inkSoft">
                Adresse e-mail
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-inkSoft">
                  {String(identifier).includes('@') ? (
                    <Icon name="mail" className="h-4 w-4" />
                  ) : (
                    <Icon name="phone" className="h-4 w-4" />
                  )}
                </span>
                <input
                  id="auth-identifier"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="vous@email.fr"
                  className="field pl-7"
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-gold mt-5 w-full" disabled={sending}>
                {sending ? 'Envoi en cours…' : 'Recevoir mon code'}
                <Icon name="arrow" className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-inkSoft">
                Aucun mot de passe à retenir : le code arrive à l’adresse indiquée et vaut {10}{' '}
                minutes.
              </p>
            </form>
          )}

          {step === 'code' && (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                verifyCode(code)
              }}
              noValidate
            >
              <p className="text-[12.5px] leading-relaxed text-inkSoft">
                Code envoyé à <strong className="font-medium text-ink">{masked || identifier}</strong>.
              </p>
              <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-[11px] leading-relaxed text-inkSoft">
                Rien reçu ? Vérifiez les indésirables. Au tout premier envoi, un message d’activation
                de <strong className="text-ink">FormSubmit</strong> arrive : cliquez une seule fois sur
                son lien. L’adresse d’expédition est <span className="text-ink">{shopEmail}</span>.
              </p>
              <label htmlFor="auth-code" className="sr-only">
                Code à 6 chiffres
              </label>
              <input
                id="auth-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="mt-4 w-full rounded-xl border border-ink/15 bg-ivory px-4 py-4 text-center font-serif text-3xl tracking-[0.5em] text-ink focus:border-goldDeep focus:outline-none"
                autoFocus
              />
              <button type="submit" className="btn-gold mt-4 w-full" disabled={code.length !== 6}>
                Valider
              </button>
              <button
                type="button"
                onClick={() => requestCode()}
                disabled={sending}
                className="mt-2 w-full text-center text-[11.5px] text-inkSoft underline-offset-4 hover:underline disabled:opacity-50"
              >
                {sending ? 'Envoi…' : 'Renvoyer un code'}
              </button>
              <button
                type="button"
                onClick={() => setStep('identify')}
                className="mt-3 w-full text-center text-[11.5px] text-inkSoft underline-offset-4 hover:underline"
              >
                Modifier mon e-mail
              </button>
            </form>
          )}

          {step === 'profile' && (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                completeProfile({
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  phone: phone.trim(),
                  newsletter,
                })
              }}
              noValidate
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="auth-first" className="text-[11px] font-medium uppercase tracking-[0.14em] text-inkSoft">
                    Prénom
                  </label>
                  <input
                    id="auth-first"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Claire"
                    className="field mt-1.5"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="auth-last" className="text-[11px] font-medium uppercase tracking-[0.14em] text-inkSoft">
                    Nom
                  </label>
                  <input
                    id="auth-last"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Durand"
                    className="field mt-1.5"
                  />
                </div>
              </div>

              <label htmlFor="auth-phone" className="mt-4 block text-[11px] font-medium uppercase tracking-[0.14em] text-inkSoft">
                Téléphone pour le suivi (optionnel)
              </label>
              <input
                id="auth-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="field mt-1.5"
              />

              <label className="mt-5 flex items-start gap-2.5 text-[12px] leading-relaxed text-inkSoft">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(event) => setNewsletter(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-goldDeep"
                />
                Recevoir les offres privées et les nouveautés (1 e-mail par mois, désinscription en 1 clic).
              </label>

              <button type="submit" className="btn-gold mt-5 w-full" disabled={!firstName.trim()}>
                Créer mon compte
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
