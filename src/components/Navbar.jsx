import { useState, useEffect, useCallback, memo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { navLinks, profile } from '../data/portfolio'
import { rafThrottle } from '../utils/rafThrottle'
import './Navbar.css'

function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) return
    const onScroll = rafThrottle(() => setScrolled(window.scrollY > 40))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    if (!isHome) {
      setScrolled(window.scrollY > 40)
      return
    }
    const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [isHome])

  const scrollTo = useCallback(
    (id) => {
      if (isHome) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate(`/#${id}`)
      }
      setMenuOpen(false)
    },
    [isHome, navigate]
  )

  useEffect(() => {
    if (!isHome || !location.hash) return
    const id = location.hash.replace('#', '')
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
    return () => clearTimeout(t)
  }, [isHome, location.hash])

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
        <span className="logo-dot" aria-hidden="true" />
        {profile.name.split(' ')[0]}
      </Link>

      <nav className={`navbar-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        {navLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            className={isHome && active === link.id ? 'active' : ''}
            onClick={() => scrollTo(link.id)}
          >
            {link.label}
          </button>
        ))}
        <Link
          to="/blog"
          className={`navbar-blog-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Blog
        </Link>
      </nav>

      <div className="navbar-actions">
        <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          type="button"
          className="menu-toggle"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default memo(Navbar)
