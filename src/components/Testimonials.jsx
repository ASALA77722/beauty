import { TESTIMONIALS } from '../data/shop'
import Icon from './Icon'
import { Reveal } from './Reveal'
import Stars from './Stars'

export default function Testimonials() {
  return (
    <section id="avis" className="scroll-mt-24 bg-cream/50 py-16 lg:py-24">
      <div className="container-x">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow">Elles nous font confiance</p>
            <h2 className="mx-auto mt-3 max-w-2xl font-serif text-[clamp(1.9rem,4vw,2.9rem)] font-light leading-tight">
              4,8/5 sur <span className="italic text-goldDeep">2 340 avis</span> vérifiés
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Stars value={5} className="h-4 w-4" />
              <span className="text-[11px] uppercase tracking-[0.14em] text-inkSoft">
                Avis collectés après achat
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.author} delay={index * 90}>
              <figure className="flex h-full flex-col border border-ink/10 bg-ivory p-6 transition-shadow duration-500 hover:shadow-card">
                <Stars value={5} className="h-3.5 w-3.5" />
                <blockquote className="mt-4 flex-1 font-serif text-[18px] leading-snug text-ink">
                  « {testimonial.quote} »
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-2.5 border-t border-ink/10 pt-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-[11px] font-semibold uppercase text-cream">
                    {testimonial.author.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-[12.5px] font-medium">{testimonial.author}</p>
                    <p className="text-[10.5px] text-inkSoft">{testimonial.detail}</p>
                  </div>
                  <Icon name="check" className="ml-auto h-3.5 w-3.5 text-sage" />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
