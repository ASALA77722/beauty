import { useState } from 'react'
import { SHOP } from '../config'
import { FAQ } from '../data/shop'
import { useAuth } from '../hooks/useAuth'
import Icon from './Icon'
import { Reveal } from './Reveal'

export default function Faq() {
  const [open, setOpen] = useState(0)
  const { openAuth } = useAuth()

  return (
    <section id="faq" className="scroll-mt-24 bg-ivory py-16 lg:py-24">
      <div className="container-x grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Questions fréquentes</p>
          <h2 className="mt-3 font-serif text-[clamp(1.9rem,4vw,2.9rem)] font-light leading-tight">
            Aide & informations
          </h2>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-inkSoft">
            Une question qui n'apparaît pas ici ? Écrivez-nous à{' '}
            <a href={`mailto:${SHOP.email}`} className="link-underline text-ink">
              {SHOP.email}
            </a>{' '}
            ou appelez le {SHOP.phone}.
          </p>

          <div className="mt-6 rounded-xl border border-gold/30 bg-cream/60 p-5">
            <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink">
              <Icon name="user" className="h-4 w-4 text-goldDeep" />
              Créer mon compte
            </p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-inkSoft">
              Avec votre e-mail <em>ou</em> votre numéro de téléphone. Pas de mot de passe : un code à
              6 chiffres sécurise chaque connexion.
            </p>
            <button type="button" onClick={() => openAuth()} className="btn-outline mt-3 w-full py-2.5 text-[10.5px]">
              Se connecter
            </button>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <dl className="divide-y divide-ink/10 border-y border-ink/10">
            {FAQ.map((item, index) => {
              const isOpen = open === index
              return (
                <div key={item.q}>
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : index)}
                      className="flex w-full items-start justify-between gap-6 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-[19px] leading-snug text-ink">{item.q}</span>
                      <span
                        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                          isOpen ? 'rotate-180 border-goldDeep bg-goldDeep text-ivory' : 'border-ink/20 text-ink'
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
                      <p className="pb-5 pr-10 text-[12.5px] leading-relaxed text-inkSoft">{item.a}</p>
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
