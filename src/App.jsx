import { useCallback, useState } from 'react'
import AuthModal from './components/AuthModal'
import Brands from './components/Brands'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Icon from './components/Icon'
import Navbar from './components/Navbar'
import Newsletter from './components/Newsletter'
import Offers from './components/Offers'
import ProductModal from './components/ProductModal'
import Shop from './components/Shop'
import Story from './components/Story'
import Testimonials from './components/Testimonials'
import TrustBar from './components/TrustBar'
import { useAuth } from './hooks/useAuth'
import { useCart } from './hooks/useCart'

function Toast() {
  const { toast, dismissToast, openCart } = useCart()
  if (!toast) return null

  return (
    <div className="fixed bottom-5 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-fade-up">
      <div className="flex items-center gap-3 rounded-xl bg-ink px-4 py-3.5 text-cream shadow-soft">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/25 text-sage">
          <Icon name="check" className="h-4 w-4" />
        </span>
        <p className="flex-1 text-[12.5px] leading-snug">
          <span className="font-medium">{toast.name}</span> ajouté au panier
        </p>
        <button
          type="button"
          onClick={() => {
            dismissToast()
            openCart()
          }}
          className="shrink-0 text-[10.5px] font-medium uppercase tracking-[0.12em] text-gold hover:text-cream"
        >
          Voir
        </button>
      </div>
    </div>
  )
}

function AuthNotice() {
  const { notice } = useAuth()
  if (!notice) return null
  return (
    <div className="fixed left-1/2 top-24 z-[95] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-fade-up rounded-full bg-forest px-5 py-3 text-center text-[12px] text-cream shadow-soft">
      {notice}
    </div>
  )
}

export default function App() {
  const [activeProduct, setActiveProduct] = useState(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { closeCart } = useCart()

  const closeProduct = useCallback(() => setActiveProduct(null), [])

  const startCheckout = useCallback(() => {
    closeCart()
    setCheckoutOpen(true)
  }, [closeCart])

  return (
    <>
      <a
        href="#boutique"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
      >
        Aller à la boutique
      </a>

      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Shop onOpenProduct={setActiveProduct} />
        <Offers />
        <Brands />
        <Story />
        <Testimonials />
        <Faq />
        <Newsletter />
      </main>
      <Footer />

      <CartDrawer onCheckout={startCheckout} />
      <ProductModal product={activeProduct} onClose={closeProduct} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <AuthModal />
      <AuthNotice />
      <Toast />
    </>
  )
}
