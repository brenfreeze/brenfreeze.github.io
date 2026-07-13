import { profile } from '../data/profile'
import { AsciiPortrait } from './AsciiPortrait'

export function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-id">
        <h1>{profile.name}</h1>
        <p className="tagline">
          {profile.role}
          <br />
          {profile.location}
        </p>
      </div>
      <div className="masthead-portrait">
        <AsciiPortrait src="/headshot.jpg" columns={72} />
      </div>
    </header>
  )
}
