import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  appendMessage,
  loadOrders,
  makeDemoOrders,
  markClientMessagesRead,
  patchOrder,
  saveOrders,
  setStatus,
} from '../lib/orders'

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => loadOrders())

  /** Synchronise entre onglets / fenêtres du même navigateur. */
  useEffect(() => {
    const sync = () => setOrders(loadOrders())
    window.addEventListener('storage', sync)
    window.addEventListener('beaute-orders-updated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('beaute-orders-updated', sync)
    }
  }, [])

  const publish = useCallback((next) => {
    setOrders(next)
    window.dispatchEvent(new Event('beaute-orders-updated'))
  }, [])

  const refresh = useCallback(() => setOrders(loadOrders()), [])

  const createOrder = useCallback(
    (order) => {
      const next = [order, ...loadOrders()]
      saveOrders(next)
      publish(next)
      return order
    },
    [publish],
  )

  const updateOrder = useCallback(
    (reference, patch) => publish(patchOrder(reference, patch)),
    [publish],
  )

  const changeStatus = useCallback(
    (reference, status) => publish(setStatus(reference, status)),
    [publish],
  )

  const sendMessage = useCallback(
    (reference, payload) => publish(appendMessage(reference, payload)),
    [publish],
  )

  const markRead = useCallback(
    (reference) => publish(markClientMessagesRead(reference)),
    [publish],
  )

  const loadDemo = useCallback(() => {
    const existing = loadOrders()
    const next = [...makeDemoOrders(), ...existing]
    saveOrders(next)
    publish(next)
  }, [publish])

  const clearDemo = useCallback(() => {
    const next = loadOrders().filter((order) => !order.demo)
    saveOrders(next)
    publish(next)
  }, [publish])

  const stats = useMemo(() => {
    const paid = orders.filter((order) =>
      ['paid', 'preparing', 'shipped', 'relay_arrived', 'delivered'].includes(order.status),
    )
    const revenue = paid.reduce((sum, order) => sum + order.amounts.total, 0)
    const awaiting = orders.filter((order) => order.status === 'awaiting_payment').length
    const toPrepare = orders.filter((order) =>
      ['paid', 'preparing'].includes(order.status),
    ).length
    const unread = orders.reduce(
      (sum, order) =>
        sum + (order.messages ?? []).filter((m) => m.from === 'client' && !m.read).length,
      0,
    )
    return { total: orders.length, paid: paid.length, revenue, awaiting, toPrepare, unread }
  }, [orders])

  const value = useMemo(
    () => ({
      orders,
      stats,
      refresh,
      createOrder,
      updateOrder,
      changeStatus,
      sendMessage,
      markRead,
      clearDemo,
      loadDemo,
    }),
    [orders, stats, refresh, createOrder, updateOrder, changeStatus, sendMessage, markRead, clearDemo, loadDemo],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) throw new Error('useOrders doit être utilisé dans un OrdersProvider')
  return context
}
