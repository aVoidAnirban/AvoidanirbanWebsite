import { useState } from 'react'
import { experience } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import './Experience.css'

export default function Experience() {
  const ref = useReveal()
  const [active, setActive] = useState(0)

  return (
    <section id="experience">
      <div ref={ref} className="reveal">
        <p className="section-label">Experience</p>
        <h2 className="section-title">Where I&apos;ve worked</h2>

        <div className="timeline">
          <div className="timeline-tabs">
            {experience.map((item, i) => (
              <button
                key={item.company}
                type="button"
                className={active === i ? 'active' : ''}
                onClick={() => setActive(i)}
              >
                <span className="tab-year">{item.year}</span>
                <span className="tab-company">{item.company}</span>
              </button>
            ))}
          </div>

          <div key={active} className="timeline-panel">
            <p className="timeline-year">{experience[active].year}</p>
            <h3>{experience[active].role}</h3>
            <p className="timeline-company">{experience[active].company}</p>
            <p className="timeline-desc">{experience[active].description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
