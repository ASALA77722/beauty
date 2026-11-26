import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './hooks/useAuth'
import { CartProvider } from './hooks/useCart'
import { OrdersProvider } from './hooks/useOrders'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <OrdersProvider>
          <App />
        </OrdersProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
