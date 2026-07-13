import { describe, expect, it } from 'vitest'
import {
  DEFAULT_RAMP,
  asciiFromPixels,
  charForLuminance,
  gridSize,
  luminance,
} from './ascii'

describe('luminance', () => {
  it('is 0 for black and 255 for white', () => {
    expect(luminance(0, 0, 0)).toBe(0)
    expect(luminance(255, 255, 255)).toBeCloseTo(255)
  })

  it('weights green heaviest, blue lightest', () => {
    expect(luminance(0, 255, 0)).toBeGreaterThan(luminance(255, 0, 0))
    expect(luminance(255, 0, 0)).toBeGreaterThan(luminance(0, 0, 255))
  })
})

describe('charForLuminance', () => {
  it('maps dark to the densest character', () => {
    expect(charForLuminance(0)).toBe('@')
  })

  it('maps light to space', () => {
    expect(charForLuminance(255)).toBe(' ')
  })

  it('stays inside the ramp for every luminance', () => {
    for (let l = 0; l <= 255; l++) {
      expect(DEFAULT_RAMP.includes(charForLuminance(l))).toBe(true)
    }
  })
})

describe('gridSize', () => {
  it('keeps the requested column count', () => {
    expect(gridSize(800, 1000, 72).cols).toBe(72)
  })

  it('halves rows to compensate for tall mono glyphs', () => {
    expect(gridSize(100, 100, 80).rows).toBe(40)
  })

  it('never returns fewer than 1 row', () => {
    expect(gridSize(10000, 1, 10).rows).toBe(1)
  })
})

describe('asciiFromPixels', () => {
  it('renders a black/white 2×1 strip as dense char + space', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255])
    expect(asciiFromPixels(data, 2, 1)).toBe('@ ')
  })

  it('joins rows with newlines', () => {
    const data = new Uint8ClampedArray([
      255, 255, 255, 255,
      255, 255, 255, 255,
    ])
    expect(asciiFromPixels(data, 1, 2)).toBe(' \n ')
  })

  it('treats transparent pixels as paper', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 0])
    expect(asciiFromPixels(data, 1, 1)).toBe(' ')
  })
})
