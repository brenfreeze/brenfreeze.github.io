import { projects } from '../data/projects'
import { Section } from './Section'

export function Projects() {
  return (
    <Section id="projects" label="Projects">
      {projects.map((project) => (
        <div className="row" key={project.name}>
          <p className="note">{project.tag}</p>
          <p className="project-line">
            {project.url ? (
              <a className="name" href={project.url} target="_blank" rel="noopener noreferrer">
                {project.name}
              </a>
            ) : (
              <span className="name">{project.name}</span>
            )}
            <span className="blurb"> — {project.blurb}</span>
          </p>
        </div>
      ))}
    </Section>
  )
}
