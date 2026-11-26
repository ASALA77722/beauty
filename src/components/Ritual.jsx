import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { PRODUCTS } from '../data/shop'
import { euro } from '../lib/format'
import Icon from './Icon'
import { Reveal } from './Reveal'

const TRIO_IDS = ['gel-nettoyant', 'serum-eclat', 'creme-nuit']
const TRIO = TRIO_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
const TRIO_TOTAL = TRIO.reduce((sum, p) => sum + p.price, 0)

const STEPS = [
  {
    n: '01',
    title: 'Nettoyer',
    product: 'Gel Douceur',
    text: "Matin et soir, masser une noisette sur peau humide. Rincer à l'eau tiède pour préserver la barrière cutanée.",
    time: '30 secondes',
    image: '/img/p4.jpg',
  },
  {
    n: '02',
    title: 'Revitaliser',
    product: 'Sérum Éclat',
    text: "Trois gouttes sur peau sèche, en pressant délicatement du centre du visage vers l'extérieur.",
    time: '1 minute',
    image: '/img/p1.jpg',
  },
  {
    n: '03',
    title: 'Nourrir',
    product: 'Crème de Nuit',
    text: 'Une noisette en dernier geste du soir, sur le visage et le cou, pour sceller les actifs pendant la nuit.',
    time: '1 minute',
    image: '/img/p2.jpg',
  },
]

export default function Ritual() {
  const [active, setActive] = useState(0)
  const { addItem } = useCart()

  const addTrio = () => {
    TRIO.forEach((product) => addItem(product, 1))
  }
  const step = STEPS[active]

  return (
    <section id="rituel" className="scroll-mt-24 overflow-hidden bg-ink py-20 text-ivory lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 border-b border-ivory/15 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest2 text-clay">
              Le rituel
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2.2rem,4.6vw,3.5rem)] font-light leading-none">
              Trois gestes, matin et soir
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ivory/60">
            Inutile de superposer dix produits. Un nettoyage, un sérum, une crème : la peau fait le
            reste.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <ul className="flex flex-col">
              {STEPS.map((item, index) => (
                <li key={item.n}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={`group flex w-full items-center gap-5 border-b border-ivory/10 py-5 text-left transition-colors ${
                      active === index ? 'text-ivory' : 'text-ivory/45 hover:text-ivory/80'
                    }`}
                    aria-pressed={active === index}
                  >
                    <span className="font-serif text-sm tracking-[0.1em]">{item.n}</span>
                    <span className="flex-1">
                      <span className="block font-serif text-2xl leading-tight">{item.title}</span>
                      <span className="mt-0.5 block text-[11px] uppercase tracking-[0.16em] opacity-70">
                        {item.product} · {item.time}
                      </span>
                    </span>
                    <Icon
                      name="arrow"
                      className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                        active === index ? 'translate-x-0 text-clay' : '-translate-x-2 opacity-0'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-7 text-[14px] leading-relaxed text-ivory/70">{step.text}</p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={addTrio}
                className="btn bg-ivory text-ink hover:bg-clay hover:text-ivory"
              >
                Ajouter le trio
                <Icon name="arrow" className="h-4 w-4" />
              </button>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ivory/45">
                Le trio complet · {euro(TRIO_TOTAL)}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden bg-ivory/5">
              <img
                key={step.image}
                src={step.image}
                alt={step.product}
                loading="lazy"
                className="aspect-[5/4] w-full object-cover animate-fade-in"
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-ivory/50">
              <span>Étape {step.n} — {step.title}</span>
              <span className="flex gap-1.5">
                {STEPS.map((item, index) => (
                  <span
                    key={item.n}
                    className={`h-1 w-6 rounded-full transition-colors ${
                      active === index ? 'bg-clay' : 'bg-ivory/20'
                    }`}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
