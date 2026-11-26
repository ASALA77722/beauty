import { useMemo, useState } from 'react'
import { CATEGORIES, PRODUCTS } from '../data/shop'
import ProductCard from './ProductCard'
import { Reveal } from './Reveal'

export default function Shop({ onOpenProduct }) {
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')

  const products = useMemo(() => {
    const filtered =
      category === 'all' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === category)

    switch (sort) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price)
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating)
      default: {
        // les produits mis en avant d'abord
        return filtered.sort((a, b) => Number(Boolean(b.tag)) - Number(Boolean(a.tag)))
      }
    }
  }, [category, sort])

  return (
    <section id="boutique" className="scroll-mt-24 bg-ivory pb-20 pt-6 lg:pb-28">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 border-b border-ink/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">La collection</p>
              <h2 className="mt-3 font-serif text-[clamp(2.2rem,4.5vw,3.4rem)] font-light leading-none">
                Nos soins essentiels
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-inkSoft">
                Sept formules, rien de plus. Chaque produit répond à un besoin précis et s'associe
                aux autres.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-full border border-ink/15 p-1">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                      category === item.id
                        ? 'bg-ink text-ivory'
                        : 'text-inkSoft hover:text-ink'
                    }`}
                    aria-pressed={category === item.id}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <label className="relative">
                <span className="sr-only">Trier les produits</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="appearance-none rounded-full border border-ink/15 bg-transparent py-2.5 pl-4 pr-9 text-[11px] font-medium uppercase tracking-[0.1em] text-inkSoft focus:outline-none"
                >
                  <option value="featured">Sélection</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-inkSoft">
                  ▾
                </span>
              </label>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 80}>
              <ProductCard product={product} onOpen={onOpenProduct} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
