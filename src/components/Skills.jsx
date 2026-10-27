import { skills } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import './Skills.css'

export default function Skills() {
  const ref = useReveal()

  return (
    <section id="skills" aria-labelledby="skills-heading">
      <div ref={ref} className="reveal">
        <p className="section-label">Skills</p>
        <h2 id="skills-heading" className="section-title">What I work with</h2>

        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-card">
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-pct">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>

        <p className="skills-hint">Edit skill levels in <code>src/data/portfolio.js</code></p>
      </div>
    </section>
  )
}
