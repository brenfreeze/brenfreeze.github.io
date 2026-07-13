import { AsciiPortrait } from './components/AsciiPortrait'

export function App() {
  return (
    <main className="page">
      <AsciiPortrait src="/headshot.jpg" columns={72} />
    </main>
  )
}
