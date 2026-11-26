import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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

/** Génère un code à 6 chiffres (simulation d'envoi e-mail / SMS). */
const makeCode = () => String(Math.floor(100000 + Math.random() * 900000))

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

  /** Étape 1 : validation de l'e-mail ou du téléphone et envoi du code. */
  const requestCode = useCallback((rawValue) => {
    const value = rawValue ?? identifier
    const trimmed = value.trim()
    const type = detectIdentifier(trimmed)

    if (!trimmed) {
      setError('Indiquez votre e-mail ou votre numéro de téléphone.')
      return false
    }
    if (type === 'email' && !isEmail(trimmed)) {
      setError('Cette adresse e-mail semble incomplète.')
      return false
    }
    if (type === 'phone' && !isPhone(trimmed)) {
      setError('Ce numéro semble incorrect (10 chiffres, ou +33 / +41…).')
      return false
    }
    if (!type) {
      setError('Saisissez une adresse e-mail ou un numéro de téléphone valide.')
      return false
    }

    const normalized = type === 'phone' ? normalizePhone(trimmed) : trimmed.toLowerCase()
    const code = makeCode()
    setIdentifier(normalized)
    setChannel(type)
    setSentCode(code)
    setError(null)
    setStep('code')
    setNotice(
      type === 'email'
        ? `Code envoyé à ${normalized} (simulation : ${code})`
        : `Code envoyé par SMS au ${normalized} (simulation : ${code})`,
    )
    return true
  }, [identifier])

  /** Étape 2 : vérification du code. */
  const verifyCode = useCallback(
    (input) => {
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
    [sentCode, user, identifier, channel],
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
