import { useState } from 'react'

/**
 * Floating pill nav, bottom center. Collapsed it shows only the initials;
 * hover or keyboard focus expands it (CSS), and the button toggles it for touch.
 */
export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className={open ? 'island open' : 'island'} aria-label="Site">
      <button
        type="button"
        className="island-toggle"
        aria-expanded={open}
        aria-label="Menu"
        onClick={() => setOpen((value) => !value)}
      >
        BA
      </button>
      <div className="island-items">
        <div className="island-items-inner">
          <a href="#about">about</a>
          <a href="#experience">experience</a>
          <a href="#projects">projects</a>
          <a href="#contact">contact</a>
        </div>
      </div>
    </nav>
  )
}
