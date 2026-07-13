import { experience } from '../data/experience'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience" label="Experience">
      {experience.map((job) => (
        <div className="row" key={`${job.company}-${job.dates}`}>
          <p className="note">{job.dates}</p>
          <div className="entry">
            <h3>{job.role}</h3>
            <p className="company">{job.company}</p>
            <p className="desc">{job.description}</p>
          </div>
        </div>
      ))}
    </Section>
  )
}
