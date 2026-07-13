import { profile } from '../data/profile'
import { AsciiPortrait } from './AsciiPortrait'

export function Masthead() {
  return (
    <header className="masthead">
      <div>
        <h1>{profile.name}</h1>
        <p className="tagline">
          {profile.role} — {profile.location}
        </p>
      </div>
      <AsciiPortrait src="/headshot.jpg" columns={72} />
    </header>
  )
}
