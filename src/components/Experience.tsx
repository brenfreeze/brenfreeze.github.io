import { experience } from '../data/experience'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience" label="Experience">
      {experience.map((job) => (
        <div className="row" key={`${job.company}-${job.dates}`}>
          <p className="note">{job.dates}</p>
          <div className="entry">
            <h3>
              {job.role} <span className="company">· {job.company}</span>
            </h3>
            <p>{job.description}</p>
          </div>
        </div>
      ))}
    </Section>
  )
}
