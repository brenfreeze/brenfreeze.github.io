import { useEffect, useState } from 'react'
import { asciiFromPixels, gridSize } from '../lib/ascii'

interface AsciiPortraitProps {
  src: string
  columns?: number
}

/**
 * Renders `src` as ASCII art (converted at runtime via canvas).
 * Hover or focus cross-fades to the real photograph.
 * Swap the portrait by replacing the image file — nothing else changes.
 */
export function AsciiPortrait({ src, columns = 72 }: AsciiPortraitProps) {
  const [ascii, setAscii] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

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
      setAscii(asciiFromPixels(data, cols, rows))
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
    <figure className="portrait" tabIndex={0}>
      <pre aria-hidden="true">{ascii ?? ''}</pre>
      <img className="portrait-photo" src={src} alt="Portrait of Bren Aviador" />
    </figure>
  )
}
