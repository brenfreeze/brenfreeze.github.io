import { awards } from '../data/awards'
import { Section } from './Section'

export function Awards() {
  return (
    <Section id="awards" label="Awards">
      <div className="award-grid">
        {awards.map((award) => (
          <div className="award-cell" key={award.text}>
            <span className="award-year">{award.year}</span>
            <p>{award.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
