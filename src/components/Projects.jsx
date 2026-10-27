import { useState, useEffect } from 'react'
import { projects } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import './Projects.css'

export default function Projects() {
  const ref = useReveal()
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [selected])

  return (
    <section id="projects">
      <div ref={ref} className="reveal">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Featured work</h2>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="project-card"
              style={{ '--accent-color': project.color }}
              onClick={() => setSelected(project)}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(project)}
              role="button"
              tabIndex={0}
            >
              <div className="project-glow" />
              <span className="project-num">0{project.id}</span>
              <h3>{project.title}</h3>
              <p>{project.description.slice(0, 80)}…</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <span className="project-cta">Click to expand →</span>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)} role="presentation">
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Close">
              ×
            </button>
            <div className="modal-header" style={{ borderColor: selected.color }}>
              <span className="project-num">0{selected.id}</span>
              <h3 id="modal-title">{selected.title}</h3>
            </div>
            <p className="modal-desc">{selected.description}</p>
            <div className="project-tags">
              {selected.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="modal-actions">
              <a href={selected.demo} className="btn btn-primary" target="_blank" rel="noreferrer">
                Live demo
              </a>
              <a href={selected.repo} className="btn btn-outline" target="_blank" rel="noreferrer">
                View code
              </a>
            </div>
            <p className="modal-note">Demo links — replace with your real URLs in portfolio.js</p>
          </div>
        </div>
      )}
    </section>
  )
}
