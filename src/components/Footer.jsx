import { profile } from '../data/portfolio'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>
        © {year} {profile.name}. Built with React + Vite — demo portfolio.
      </p>
      <p className="footer-edit">Edit content in <code>src/data/portfolio.js</code></p>
    </footer>
  )
}
