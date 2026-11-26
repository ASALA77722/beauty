import { PROMISES } from '../data/shop'
import Icon from './Icon'
import { Reveal } from './Reveal'

const ICONS = ['leaf', 'sparkle', 'shield']

export default function Values() {
  return (
    <section className="bg-ivory py-16 lg:py-20">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {PROMISES.map((promise, index) => (
            <Reveal key={promise.title} delay={index * 110}>
              <div className="group relative">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-clay/25 text-clay transition-colors duration-500 group-hover:bg-clay group-hover:text-ivory">
                  <Icon name={ICONS[index]} className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-2xl text-ink">{promise.title}</h3>
                <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-inkSoft">
                  {promise.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
