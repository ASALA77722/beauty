import { TESTIMONIALS } from '../data/shop'
import Icon from './Icon'
import { Reveal } from './Reveal'

export default function Testimonials() {
  return (
    <section id="avis" className="scroll-mt-24 bg-ivory py-20 lg:py-28">
      <div className="container-x">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow">Elles en parlent</p>
            <h2 className="mx-auto mt-3 max-w-2xl font-serif text-[clamp(2rem,4.2vw,3rem)] font-light leading-tight">
              1 200 avis vérifiés, une moyenne de <span className="italic text-clay">4,9/5</span>
            </h2>
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="flex gap-1 text-clay">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon key={index} name="star" className="h-4 w-4 fill-clay/25" />
                ))}
              </div>
              <span className="text-xs uppercase tracking-[0.14em] text-inkSoft">
                Avis collectés sur Trustpilot
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.author} delay={index * 110}>
              <figure className="flex h-full flex-col border border-ink/10 bg-ivory p-7 transition-shadow duration-500 hover:shadow-card">
                <div className="flex gap-1 text-clay">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Icon key={starIndex} name="star" className="h-3.5 w-3.5 fill-clay/25" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-serif text-[19px] leading-snug text-ink">
                  « {testimonial.quote} »
                </blockquote>
                <figcaption className="mt-6 border-t border-ink/10 pt-4">
                  <p className="text-sm font-medium">{testimonial.author}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-inkSoft">
                    {testimonial.detail}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
