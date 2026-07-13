import { profile } from '../data/profile'
import { Section } from './Section'

export function About() {
  return (
    <Section id="about" label="About">
      <div className="row">
        <div className="note" aria-hidden="true" />
        <div className="about">
          {profile.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <ul className="tech-list">
            {profile.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
