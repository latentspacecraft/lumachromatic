import { atom, selector } from 'recoil'
import { Scale } from '@tonaljs/tonal'
import Palette from '../lib/Palette'
import { TwelveToneMap } from '../lib/lumatone/ToneMap'
import { BoardGeometry } from '../lib/lumatone/BoardGeometry'

export const harmonicParamState = atom({
  key: 'harmonicParamState',
  default: {
    scale: Scale.get('C major'),
  },
})

export const colorParamState = atom({
  key: 'colorParamState',
  default: {
    palette: new Palette(12),
  },
})

export const toneMappingParamState = atom({
  key: 'toneMappingParamState',
  default: {
    startingNote: 'C',
    startingOctave: 1,
  },
})

export const toneMappingState = selector({
  key: 'toneMappingState',
  get: ({ get }) => {
    const { startingNote, startingOctave } = get(toneMappingParamState)
    const toneMap = TwelveToneMap(`${startingNote}${startingOctave}`)
    return { toneMap }
  },
})

export const boardParamState = atom({
  key: 'boardParamState',
  default: {
    keyDiameter: 28,
    keyMargin: 2,
    numBoards: 5,
  },
})

export const boardGeometryState = selector({
  key: 'boardGeometryState',
  get: ({ get }) => {
    const { keyDiameter, keyMargin } = get(boardParamState)
    return new BoardGeometry({ keyDiameter, keyMargin })
  },
})
