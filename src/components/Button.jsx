const base =
  'inline-flex items-center justify-center gap-2.5 rounded-lg border font-bold transition hover:-translate-y-0.5'

const variants = {
  primary: 'border-transparent bg-accent text-bg hover:brightness-110',
  outline: 'border-line text-ink hover:border-accent',
}

const sizes = {
  md: 'min-h-12 px-6 text-[15px]',
  sm: 'min-h-11 px-5 text-[15px]',
  lg: 'min-h-13 px-7 font-mono text-base break-all',
}

export default function Button({ href, variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </a>
  )
}
