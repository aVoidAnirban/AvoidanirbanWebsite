import { stack } from '../data/stack'
import Section, { SectionHead } from './Section'
import Reveal from './Reveal'

export default function Stack() {
  return (
    <Section id="stack" alt>
      <SectionHead eyebrow="02 / stack" title="What I work with" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-6">
        {stack.map((group, i) => (
          <Reveal key={group.label} delay={(i % 4) * 70} className="h-full">
            <div className="flex h-full flex-col gap-4.5 rounded-xl border border-line bg-panel p-6">
              <h3 className="font-mono text-sm font-medium text-accent">{group.label}</h3>
              <ul className="flex flex-wrap gap-2 ">
                {group.items.map((item) => (
                  <li key={item} className="cursor-default rounded-md border border-line bg-bg px-3 py-1.5 text-sm  hover: delay-100 hover:underline underline-offset-4 decoration-2 ease-in  hover:text-gray-400 transition-colors duration-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
