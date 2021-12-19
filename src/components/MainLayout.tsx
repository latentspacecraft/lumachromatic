import React, { useState } from 'react'
import DockLayout from 'rc-dock'
import 'rc-dock/dist/rc-dock-dark.css'
import type { LayoutBase } from 'rc-dock'

import ColorWheel from '../components/ColorWheel'
import ParamsPanel from '../components/ParamsPanel'
import MidiPanel from '../components/MidiPanel'
import MultiBoard from '../components/MultiBoard'
import ParamsContext, { defaultParams } from '../context/params'
import { AllParams } from '../types'
import { exportLumatoneIni } from '../lib/lumatone/export'
import { BoardGeometry } from '../lib/lumatone/BoardGeometry'
import { LayoutContext } from '../context/layout'
import HarmonyPanel from './HarmonyPanel'

export const MainLayout = () => {
  const [params, setParams] = useState(defaultParams)
  const [layout, setLayout] = useState<LayoutBase | null>(null)

  const onChange = (partialParams: Partial<AllParams>) => {
    const p = { ...params, ...partialParams }
    // @ts-ignore
    setParams(p)
  }

  const onExport = () => {
    console.log('exporting lumatone config')
    const {
      harmonic: { scale },
      color: { palette },
      mapping: { toneMap },
    } = params
    const ini = exportLumatoneIni(toneMap, palette, scale)
    const blob = new Blob([ini], { type: 'text/plain;charset=utf-8' })
    const filename = scale.name + '.ltn'
    saveAs(blob, filename)
  }

  const harmonyPanel = <HarmonyPanel />
  const midiPanel = <MidiPanel />
  const paramsPanel = (
    <ParamsPanel onChange={onChange} exportReqested={onExport} />
  )
  const colorWheel = <ColorWheel radius={150} />

  const keyDiameter = 28
  const keyMargin = 2
  const geometry = new BoardGeometry({ keyDiameter, keyMargin })

  const board = (
    <div className="BoardContainer">
      <MultiBoard {...{ geometry, numBoards: 5 }} />
    </div>
  )

  const paramsLayout = {
    mode: 'vertical' as const,
    size: 200,

    children: [
      {
        tabs: [{ id: 'wheel', title: 'color wheel', content: colorWheel }],
      },
      {
        tabs: [
          { id: 'harmony', title: 'Harmony', content: harmonyPanel },
          { id: 'params', title: 'params', content: paramsPanel },
          { id: 'midi', title: 'midi', content: midiPanel },
        ],
      },
    ],
  }

  const defaultLayout = {
    dockbox: {
      mode: 'horizontal' as const,
      children: [
        paramsLayout,
        {
          size: 800,
          tabs: [{ id: 'board', title: 'board', content: board }],
          panelLock: { panelStyle: 'main' },
        },
      ],
    },
  }

  const layoutChanged = (newLayout: LayoutBase) => {
    setLayout(newLayout)
  }

  return (
    <LayoutContext.Provider value={layout}>
      <ParamsContext.Provider value={params}>
        <DockLayout
          defaultLayout={defaultLayout}
          onLayoutChange={layoutChanged}
          style={{
            position: 'absolute',
            left: 10,
            top: 10,
            right: 10,
            bottom: 10,
          }}
        />
      </ParamsContext.Provider>
    </LayoutContext.Provider>
  )
}
