import { loadOrders } from './orders'

/**
 * Commandes utilisables pour déposer un avis : passées sur cet appareil,
 * payées au minimum. Le numéro de commande sert de preuve d'achat.
 */
export const loadOrdersForReview = () =>
  loadOrders().filter((order) =>
    ['paid', 'preparing', 'shipped', 'relay_arrived', 'delivered'].includes(order.status),
  )

export const ORDER_STATUSES_LABELS_SHORT = {
  paid: 'Payée',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  relay_arrived: 'En point relais',
  delivered: 'Livrée',
}
