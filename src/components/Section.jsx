// Page section wrapper + shared heading.
export default function Section({ id, alt = false, className = '', children }) {
  return (
    <section
      id={id}
      className={`border-t border-line-soft py-16 sm:py-24 ${alt ? 'bg-bg-alt' : ''} ${className}`}
    >
      <div className="wrap">{children}</div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, className = 'mb-8 sm:mb-12' }) {
  return (
    <header className={`flex flex-col gap-3 ${className}`}>
      <p className="font-mono text-sm text-accent">{eyebrow}</p>
      <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] font-extrabold tracking-tight">{title}</h2>
    </header>
  )
}
