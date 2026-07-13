/** Characters from lightest (paper) to densest (ink). */
export const DEFAULT_RAMP = ' .:;+*#@'

/** Rec. 709 relative luminance on 0–255 channel values. */
export function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Dark pixels get dense characters; light pixels fade to paper. */
export function charForLuminance(lum: number, ramp: string = DEFAULT_RAMP): string {
  const idx = Math.floor((1 - lum / 255) * ramp.length)
  return ramp[Math.max(0, Math.min(ramp.length - 1, idx))]
}

/**
 * Character-grid dimensions for an image. `charAspect` is the width:height
 * ratio of a mono glyph (~0.5), so rows are halved to keep proportions.
 */
export function gridSize(
  imgWidth: number,
  imgHeight: number,
  columns: number,
  charAspect = 0.5,
): { cols: number; rows: number } {
  const rows = Math.max(1, Math.round((imgHeight / imgWidth) * columns * charAspect))
  return { cols: columns, rows }
}

/** Convert RGBA pixel data (cols × rows) into an ASCII string. */
export function asciiFromPixels(
  data: Uint8ClampedArray,
  cols: number,
  rows: number,
  ramp: string = DEFAULT_RAMP,
): string {
  const lines: string[] = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      if (data[i + 3] < 128) {
        line += ' '
        continue
      }
      line += charForLuminance(luminance(data[i], data[i + 1], data[i + 2]), ramp)
    }
    lines.push(line)
  }
  return lines.join('\n')
}
