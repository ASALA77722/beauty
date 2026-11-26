import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS, PAYMENT_METHOD } from '../data/shop'
import { CART_KEY, readJson, writeJson } from '../lib/format'
import { computeTotals } from '../lib/pricing'

const CartContext = createContext(null)

function enrich(lines) {
  return lines
    .map((line) => {
      const product = PRODUCTS.find((p) => p.id === line.id)
      return product ? { ...line, product } : null
    })
    .filter(Boolean)
}

const initialLines = () => {
  const parsed = readJson(CART_KEY, [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter(
    (item) => item && typeof item.id === 'string' && Number.isFinite(item.qty) && item.qty > 0,
  )
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(initialLines)
  const [isOpen, setIsOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [promoInput, setPromoInput] = useState('')
  const [appliedCode, setAppliedCode] = useState(null)
  const [reservedUntil, setReservedUntil] = useState(() => Date.now() + 15 * 60000)

  useEffect(() => {
    writeJson(CART_KEY, lines)
  }, [lines])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3400)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const items = useMemo(() => enrich(lines), [lines])
  const payment = PAYMENT_METHOD
  const totals = useMemo(
    () => computeTotals(items, { code: appliedCode, payment }),
    [items, appliedCode, payment],
  )

  const addItem = useCallback((product, qty = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === product.id)
      if (existing) {
        return current.map((line) =>
          line.id === product.id ? { ...line, qty: Math.min(line.qty + qty, 99) } : line,
        )
      }
      return [...current, { id: product.id, qty }]
    })
    setReservedUntil(Date.now() + 15 * 60000)
    setToast({ name: product.name, qty })
  }, [])

  const setQty = useCallback((id, qty) => {
    setLines((current) =>
      qty <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, qty: Math.min(qty, 99) } : line)),
    )
  }, [])

  const removeItem = useCallback((id) => {
    setLines((current) => current.filter((line) => line.id !== id))
  }, [])

  const clear = useCallback(() => {
    setLines([])
    setAppliedCode(null)
    setPromoInput('')
  }, [])

  const applyPromo = useCallback(
    (value) => {
      const code = (value ?? promoInput).trim().toUpperCase()
      if (!code) return
      setAppliedCode(code)
      setPromoInput(code)
    },
    [promoInput],
  )

  const removePromo = useCallback(() => {
    setAppliedCode(null)
    setPromoInput('')
  }, [])

  const value = useMemo(
    () => ({
      items,
      count: totals.count,
      ...totals,
      addItem,
      setQty,
      removeItem,
      clear,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      promoInput,
      setPromoInput,
      appliedCode,
      applyPromo,
      removePromo,
      payment,
      reservedUntil,
      toast,
      dismissToast: () => setToast(null),
    }),
    [
      items,
      totals,
      addItem,
      setQty,
      removeItem,
      clear,
      isOpen,
      promoInput,
      appliedCode,
      applyPromo,
      removePromo,
      payment,
      reservedUntil,
      toast,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart doit être utilisé dans un CartProvider')
  return context
}
