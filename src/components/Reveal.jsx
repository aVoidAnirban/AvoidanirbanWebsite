import { useInView } from '../hooks/useInView'

// Fades and slides its children in when they scroll into view.
export default function Reveal({ delay = 0, className = '', children }) {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-500 motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
