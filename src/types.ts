import type { Scale as ScaleT } from '@tonaljs/scale'
import { RXBArray } from './lib/RXB'

export type Point = { x: number; y: number }
export type Size = { w: number; h: number }
export type Rect = { origin: Point; size: Size }

export type HexColor = string

/**
 * OffsetCoord is a point on the hex grid in "offset coordinates," using the "odd-r" layout described
 * here: https://www.redblobgames.com/grids/hexagons/#coordinates
 */
export interface OffsetCoord {
  q: number
  r: number
}

export interface IPalette {
  divisions: Readonly<number>
  rainbow: RXBArray[]

  primary(index: number): HexColor
  complementary(index: number, value: number): HexColor
  neutrals(index: number, value: number, count?: number): HexColor[]
  colorForNoteName(
    noteName: string,
    scale: ScaleT | undefined
  ): HexColor | undefined
  noteColors(note: string): {
    primary: HexColor
    muted: HexColor
    complementary: (value: number) => HexColor
  }
}

export interface KeyDefinition {
  note: string // TODO: maybe use Note type from tonaljs
}

export interface ToneMap {
  get(c: OffsetCoord): KeyDefinition | undefined

  transposed(semitones: number): ToneMap
}

export type KeyGenerator = Generator<KeyDefinition>
