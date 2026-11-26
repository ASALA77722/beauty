import { useState } from 'react'
import { FAQ } from '../data/shop'
import Icon from './Icon'
import { Reveal } from './Reveal'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="scroll-mt-24 bg-sand/60 py-20 lg:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Questions fréquentes</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4.2vw,3rem)] font-light leading-tight">
            Tout ce qu'il faut savoir
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-inkSoft">
            Une question qui n'apparaît pas ici ? Écrivez-nous à{' '}
            <a
              href="mailto:bonjour@maisonlumiere.fr"
              className="link-underline text-ink"
            >
              bonjour@maisonlumiere.fr
            </a>
            , nous répondons sous 24 h.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <dl className="divide-y divide-ink/10 border-y border-ink/10">
            {FAQ.map((item, index) => {
              const isOpen = open === index
              return (
                <div key={item.q}>
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : index)}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-xl leading-snug text-ink">{item.q}</span>
                      <span
                        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 border-clay bg-clay text-ivory' : 'text-ink'
                        }`}
                      >
                        <Icon name="chevron" className="h-4 w-4" />
                      </span>
                    </button>
                  </dt>
                  <dd
                    className={`grid transition-all duration-500 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-10 text-[13.5px] leading-relaxed text-inkSoft">
                        {item.a}
                      </p>
                    </div>
                  </dd>
                </div>
              )
            })}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
