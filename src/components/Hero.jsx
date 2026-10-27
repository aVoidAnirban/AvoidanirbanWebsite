import { profile } from '../data/portfolio'
import { useTypewriter } from '../hooks/useTypewriter'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import './Hero.css'

export default function Hero() {
  const typed = useTypewriter(profile.roles, 120, 2500)
  const reducedMotion = usePrefersReducedMotion()

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="hero-bg" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-badge">
          <span className="status-dot" />
          {profile.availability}
        </p>

        <h1 className="hero-title">
          Hi, I&apos;m <span className="gradient-text">{profile.name}</span>
        </h1>

        <p className="hero-subtitle">
          {profile.title} — {profile.tagline}
        </p>

        <p className="hero-typewriter">
          I am a <span className="typed">{typed}</span>
          {!reducedMotion && <span className="cursor-blink">|</span>}
        </p>

        <div className="hero-cta">
          <button type="button" className="btn btn-primary" onClick={() => scrollTo('projects')}>
            View my work
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="btn btn-outline" onClick={() => scrollTo('contact')}>
            Get in touch
          </button>
        </div>

        <nav className="hero-social" aria-label="Social links">
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </nav>
      </div>

      <div className="hero-card">
        <div className="code-window">
          <div className="code-dots">
            <button type="button" className="traffic-light traffic-close" aria-label="Close" />
            <button type="button" className="traffic-light traffic-minimize" aria-label="Minimize" />
            <button type="button" className="traffic-light traffic-maximize" aria-label="Maximize" />
          </div>
          <pre>
            <code>{`const dev = {
  name: "${profile.name}",
  role: "${profile.title}",
  skills: ["React", "Node", "..."],
  openToWork: true
};`}</code>
          </pre>
        </div>
        <p className="hero-location">📍 {profile.location}</p>
      </div>

      <a href="#about" className="scroll-hint" aria-label="Scroll to about section">
        <span className="scroll-wheel" />
      </a>
    </section>
  )
}
