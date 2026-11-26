import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../data/shop'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, readCart, writeCart } from '../lib/format'

const CartContext = createContext(null)

function enrich(lines) {
  return lines
    .map((line) => {
      const product = PRODUCTS.find((p) => p.id === line.id)
      return product ? { ...line, product } : null
    })
    .filter(Boolean)
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => readCart())
  const [isOpen, setIsOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    writeCart(lines)
  }, [lines])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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

  const clear = useCallback(() => setLines([]), [])

  const items = useMemo(() => enrich(lines), [lines])
  const count = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [items],
  )
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      remainingForFreeShipping,
      addItem,
      setQty,
      removeItem,
      clear,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toast,
      dismissToast: () => setToast(null),
    }),
    [
      items,
      count,
      subtotal,
      shipping,
      remainingForFreeShipping,
      addItem,
      setQty,
      removeItem,
      clear,
      isOpen,
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
