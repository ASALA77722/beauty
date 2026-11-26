import { useMemo, useState } from 'react'
import { BRANDS, CATEGORIES, CONCERNS, PRODUCTS, brandOf } from '../data/shop'
import ProductCard from './ProductCard'
import { Reveal } from './Reveal'

export default function Shop({ onOpenProduct }) {
  const [category, setCategory] = useState('all')
  const [concern, setConcern] = useState('Tout')
  const [brand, setBrand] = useState('all')
  const [sort, setSort] = useState('featured')

  const products = useMemo(() => {
    let list = [...PRODUCTS]
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (concern !== 'Tout') list = list.filter((p) => p.concern === concern)
    if (brand !== 'all') list = list.filter((p) => p.brandId === brand)

    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      case 'discount':
        return list.sort(
          (a, b) =>
            (b.marketPrice - b.price) / b.marketPrice - (a.marketPrice - a.price) / a.marketPrice,
        )
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating)
      default:
        return list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller))
    }
  }, [category, concern, brand, sort])

  return (
    <section id="boutique" className="scroll-mt-24 bg-ivory py-16 lg:py-20">
      <div className="container-x">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow">La sélection</p>
            <h2 className="mt-3 font-serif text-[clamp(2.1rem,4.4vw,3.4rem)] font-light leading-none">
              Les soins des grandes maisons
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-inkSoft">
              Quatre références choisies pour leur efficacité, vendues à prix juste. Le prix barré
              est le prix constaté en magasin.
            </p>
          </div>
        </Reveal>

        <div className="mt-9 flex flex-col gap-4 border-y border-ink/10 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-inkSoft">Type</span>
              <div className="flex rounded-full border border-ink/15 p-1">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    aria-pressed={category === item.id}
                    className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.1em] transition-colors ${
                      category === item.id ? 'bg-ink text-ivory' : 'text-inkSoft hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-inkSoft">
                Besoin
              </span>
              <div className="flex rounded-full border border-ink/15 p-1">
                {CONCERNS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setConcern(item)}
                    aria-pressed={concern === item}
                    className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.1em] transition-colors ${
                      concern === item ? 'bg-forest text-cream' : 'text-inkSoft hover:text-ink'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 rounded-full bg-cream px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.1em] text-inkSoft">
                {products.length} produit{products.length > 1 ? 's' : ''}
              </span>
              <label htmlFor="brand-select" className="text-[10px] uppercase tracking-[0.16em] text-inkSoft">
                Marque
              </label>
              <select
                id="brand-select"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="rounded-full border border-ink/15 bg-transparent px-3 py-1.5 text-[11px] text-ink focus:outline-none"
              >
                <option value="all">Toutes</option>
                {BRANDS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <label htmlFor="sort-select" className="ml-2 text-[10px] uppercase tracking-[0.16em] text-inkSoft">
                Trier
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-full border border-ink/15 bg-transparent px-3 py-1.5 text-[11px] text-ink focus:outline-none"
              >
                <option value="featured">Sélection</option>
                <option value="discount">Meilleures remises</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="mt-10 border border-ink/10 bg-cream/60 p-10 text-center text-sm text-inkSoft">
            Aucun produit ne correspond à ces filtres.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 70}>
                <ProductCard product={product} onOpen={onOpenProduct} />
              </Reveal>
            ))}
          </div>
        )}

        <p className="mt-8 text-[11px] leading-relaxed text-inkSoft">
          Prix barrés = prix conseillés constatés en parfumerie en novembre 2026. Les remises
          automatiques et le prix de lancement s'appliquent en plus, directement dans le panier.
        </p>
      </div>
    </section>
  )
}
