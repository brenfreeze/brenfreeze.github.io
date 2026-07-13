import { profile } from '../data/profile'

export function Contact() {
  return (
    <footer className="section footer" id="contact">
      <div className="section-head">
        <h2>Contact</h2>
      </div>
      <div className="row">
        <div className="note" aria-hidden="true" />
        <div>
          <p className="invite">Always open to new opportunities and collaborations — say hello.</p>
          <div className="links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              github
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin
            </a>
          </div>
          <p className="colophon">
            Designed &amp; built by Bren Aviador · set in Instrument Serif, IBM Plex Sans &amp; Mono
          </p>
        </div>
      </div>
    </footer>
  )
}
