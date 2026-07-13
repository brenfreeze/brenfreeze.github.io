import { About } from './components/About'
import { Awards } from './components/Awards'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Masthead } from './components/Masthead'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'

export function App() {
  return (
    <div className="page">
      <Nav />
      <Masthead />
      <main>
        <About />
        <Experience />
        <Projects />
        <Awards />
      </main>
      <Contact />
    </div>
  )
}
