import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CODE_TTL_MINUTES, SHOP } from '../config'
import { sendLoginCode } from '../lib/mail'
import {
  USER_KEY,
  detectIdentifier,
  isEmail,
  isPhone,
  normalizePhone,
  readJson,
  removeStored,
  writeJson,
} from '../lib/format'

const AuthContext = createContext(null)

/** Code à 6 chiffres, tiré au hasard de façon cryptographique. */
const makeCode = () => {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return String(100000 + (buffer[0] % 900000))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = readJson(USER_KEY, null)
    return stored && stored.identifier ? stored : null
  })
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState('identify') // identify | code | profile
  const [identifier, setIdentifier] = useState('')
  const [channel, setChannel] = useState(null) // email | phone
  const [error, setError] = useState(null)
  const [sentCode, setSentCode] = useState(null)
  const [sentAt, setSentAt] = useState(null)
  const [sending, setSending] = useState(false)
  const [masked, setMasked] = useState('')
  const [pendingUser, setPendingUser] = useState(null)
  const [notice, setNotice] = useState(null)
  const resolveAction = useRef(null)

  useEffect(() => {
    if (user) writeJson(USER_KEY, user)
    else removeStored(USER_KEY)
  }, [user])

  useEffect(() => {
    if (!isOpen) {
      setError(null)
      setSentCode(null)
      setStep('identify')
    }
  }, [isOpen])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  const openAuth = useCallback((action = null) => {
    resolveAction.current = action
    setStep('identify')
    setIdentifier('')
    setError(null)
    setPendingUser(null)
    setIsOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setIsOpen(false)
    resolveAction.current = null
  }, [])

  /** Étape 1 : validation de l'identifiant et envoi du code. */
  const requestCode = useCallback(
    async (rawValue) => {
      const value = rawValue ?? identifier
      const trimmed = value.trim()
      const type = detectIdentifier(trimmed)

      if (!trimmed) {
        setError('Indiquez votre adresse e-mail.')
        return false
      }
      if (type !== 'email' || !isEmail(trimmed)) {
        setError(
          type === 'phone'
            ? 'Le code de connexion part par e-mail : indiquez votre adresse e-mail. Votre téléphone reste demandé au moment de la commande, pour la livraison.'
            : 'Cette adresse e-mail semble incomplète.',
        )
        return false
      }

      const normalized = trimmed.toLowerCase()
      const [local, domain] = normalized.split('@')
      const emailMask = `${local.slice(0, 2)}${'•'.repeat(Math.max(1, local.length - 2))}@${domain}`
      const code = makeCode()
      setIdentifier(normalized)
      setChannel('email')
      setError(null)
      setSending(true)
      try {
        await sendLoginCode({ to: normalized, code, minutes: CODE_TTL_MINUTES })
        setSentCode(code)
        setSentAt(Date.now())
        setMasked(emailMask)
        setStep('code')
        setNotice(`Code envoyé à ${emailMask}`)
        return true
      } catch {
        setError(
          "L'envoi de l'e-mail a échoué. Vérifiez votre adresse, puis réessayez dans un instant.",
        )
        return false
      } finally {
        setSending(false)
      }
    },
    [identifier],
  )

  /** Étape 2 : vérification du code. */
  const verifyCode = useCallback(
    (input) => {
      if (sentAt && Date.now() - sentAt > CODE_TTL_MINUTES * 60000) {
        setError('Ce code a expiré. Demandez-en un nouveau.')
        return false
      }
      if (input.trim() !== sentCode) {
        setError('Ce code ne correspond pas. Vérifiez les 6 chiffres.')
        return false
      }
      setError(null)
      const nextUser = user ?? {
        identifier,
        channel,
        firstName: '',
        lastName: '',
        phone: channel === 'phone' ? identifier : '',
        email: channel === 'email' ? identifier : '',
        newsletter: true,
        createdAt: new Date().toISOString(),
      }
      setPendingUser(nextUser)
      if (!user) {
        setStep('profile')
        return true
      }
      // utilisateur connu : connexion immédiate
      setUser(nextUser)
      setIsOpen(false)
      setNotice('Connexion réussie — bon retour !')
      const action = resolveAction.current
      resolveAction.current = null
      action?.()
      return true
    },
    [sentCode, sentAt, user, identifier, channel],
  )

  /** Étape 3 : complément du profil (nouvelle cliente). */
  const completeProfile = useCallback(
    (details) => {
      const nextUser = { ...pendingUser, ...details }
      setUser(nextUser)
      setIsOpen(false)
      setNotice('Votre compte est créé. Bonne découverte !')
      const action = resolveAction.current
      resolveAction.current = null
      action?.()
      return true
    },
    [pendingUser],
  )

  const logout = useCallback(() => {
    setUser(null)
    setNotice('Vous êtes déconnectée.')
  }, [])

  const requireAuth = useCallback(
    (action) => {
      if (user) {
        action?.()
        return true
      }
      openAuth(action)
      return false
    },
    [user, openAuth],
  )

  const displayName = user?.firstName?.trim() || user?.identifier || ''

  const value = useMemo(
    () => ({
      user,
      displayName,
      isOpen,
      step,
      setStep,
      identifier,
      setIdentifier,
      channel,
      error,
      setError,
      notice,
      setNotice,
      sentCode,
      sending,
      shopEmail: SHOP.authEmail,
      openAuth,
      closeAuth,
      requestCode,
      verifyCode,
      completeProfile,
      logout,
      requireAuth,
      isAuthenticated: Boolean(user),
    }),
    [
      user,
      displayName,
      isOpen,
      step,
      identifier,
      channel,
      error,
      notice,
      sentCode,
      sending,
      masked,
      openAuth,
      closeAuth,
      requestCode,
      verifyCode,
      completeProfile,
      logout,
      requireAuth,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return context
}
