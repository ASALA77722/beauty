import { useCallback, useState } from 'react'
import CartDrawer from './components/CartDrawer'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Icon from './components/Icon'
import Ingredients from './components/Ingredients'
import Navbar from './components/Navbar'
import Newsletter from './components/Newsletter'
import ProductModal from './components/ProductModal'
import Ritual from './components/Ritual'
import Shop from './components/Shop'
import Story from './components/Story'
import Testimonials from './components/Testimonials'
import Values from './components/Values'
import { useCart } from './hooks/useCart'

function Toast() {
  const { toast, dismissToast, openCart } = useCart()
  if (!toast) return null

  return (
    <div className="fixed bottom-5 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-fade-up">
      <div className="flex items-center gap-3 rounded-sm bg-ink px-4 py-3.5 text-ivory shadow-soft">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/25 text-sage">
          <Icon name="check" className="h-4 w-4" />
        </span>
        <p className="flex-1 text-[13px] leading-snug">
          <span className="font-medium">{toast.name}</span> ajouté au panier
        </p>
        <button
          type="button"
          onClick={() => {
            dismissToast()
            openCart()
          }}
          className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-clay hover:text-ivory"
        >
          Voir
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [activeProduct, setActiveProduct] = useState(null)
  const closeProduct = useCallback(() => setActiveProduct(null), [])

  return (
    <>
      <a
        href="#boutique"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-ivory"
      >
        Aller à la boutique
      </a>

      <Navbar />
      <main>
        <Hero />
        <Values />
        <Shop onOpenProduct={setActiveProduct} />
        <Story />
        <Ritual />
        <Ingredients />
        <Testimonials />
        <Faq />
        <Newsletter />
      </main>
      <Footer />

      <CartDrawer />
      <ProductModal product={activeProduct} onClose={closeProduct} />
      <Toast />
    </>
  )
}
