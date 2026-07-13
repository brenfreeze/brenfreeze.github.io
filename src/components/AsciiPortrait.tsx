import { useEffect, useState } from 'react'
import { asciiFromPixels, DEFAULT_RAMP, gridSize } from '../lib/ascii'

interface AsciiPortraitProps {
  src: string
  columns?: number
}

/* The default ramp puts dense characters on dark pixels, which reads correctly
   only on a light background. On a dark background the glyphs are the bright
   thing, so bright pixels must get the dense characters instead. */
const DARK_RAMP = [...DEFAULT_RAMP].reverse().join('')

const DARK_SCHEME = '(prefers-color-scheme: dark)'

/**
 * Renders `src` as ASCII art (converted at runtime via canvas).
 * Hover or focus cross-fades to the real photograph.
 * Swap the portrait by replacing the image file — nothing else changes.
 */
export function AsciiPortrait({ src, columns = 72 }: AsciiPortraitProps) {
  const [ascii, setAscii] = useState<{ light: string; dark: string } | null>(null)
  const [failed, setFailed] = useState(false)
  const [isDark, setIsDark] = useState(() => window.matchMedia(DARK_SCHEME).matches)

  useEffect(() => {
    const query = window.matchMedia(DARK_SCHEME)
    const onChange = (event: MediaQueryListEvent) => setIsDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.src = src
    img.onload = () => {
      if (cancelled) return
      const { cols, rows } = gridSize(img.naturalWidth, img.naturalHeight, columns)
      const canvas = document.createElement('canvas')
      canvas.width = cols
      canvas.height = rows
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) {
        setFailed(true)
        return
      }
      ctx.drawImage(img, 0, 0, cols, rows)
      const { data } = ctx.getImageData(0, 0, cols, rows)
      setAscii({
        light: asciiFromPixels(data, cols, rows),
        dark: asciiFromPixels(data, cols, rows, DARK_RAMP),
      })
    }
    img.onerror = () => {
      if (!cancelled) setFailed(true)
    }
    return () => {
      cancelled = true
    }
  }, [src, columns])

  if (failed) {
    return (
      <div className="portrait portrait-fallback" aria-hidden="true">
        BA
      </div>
    )
  }

  return (
    <figure className="portrait" tabIndex={0} aria-label="Portrait of Bren Aviador">
      <pre aria-hidden="true">{ascii ? (isDark ? ascii.dark : ascii.light) : ''}</pre>
      <img className="portrait-photo" src={src} alt="Portrait of Bren Aviador" />
    </figure>
  )
}
