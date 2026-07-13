import { projects } from '../data/projects'
import { Section } from './Section'

export function Projects() {
  return (
    <Section id="projects" label="Projects">
      <div className="project-grid">
        {projects.map((project, index) => {
          const className = index % 4 === 0 ? 'project-cell wide' : 'project-cell'
          const body = (
            <>
              <span className="project-name">{project.name}</span>
              <span className="project-blurb">{project.blurb}</span>
              <span className="project-tag">{project.tag}</span>
            </>
          )
          return project.url ? (
            <a
              className={className}
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {body}
            </a>
          ) : (
            <div className={className} key={project.name}>
              {body}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
