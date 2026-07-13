import { awards } from '../data/awards'
import { Section } from './Section'

export function Awards() {
  return (
    <Section id="awards" label="Awards">
      {awards.map((award) => (
        <div className="row" key={award.text}>
          <p className="note">{award.year}</p>
          <p className="project-line">
            <span className="blurb">{award.text}</span>
          </p>
        </div>
      ))}
    </Section>
  )
}
