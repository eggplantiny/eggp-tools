import type { IModel } from 'makerjs'
import type opentype from 'opentype.js'
import makerjs from 'makerjs'
import { useEffect, useState } from 'react'

type FillRule = 'nonzero' | 'evenodd'

interface MakerJsOptions {
  font: opentype.Font | null
  text: string
  size?: number
  union?: boolean
  filled?: boolean
  kerning?: boolean
  separate?: boolean
  bezierAccuracy?: number
  units?: string
  fill?: string
  stroke?: string
  strokeWidth?: string
  strokeNonScaling?: boolean
  fillRule?: FillRule
}

function debounce(callback: any, wait = 200) {
  let timeoutId: any = null

  return (...args) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      callback.apply(null, args)
    }, wait)
  }
}

export function useMakerJs(options: MakerJsOptions) {
  const [svgOutput, setSvgOutput] = useState<string>('')
  const [dxfOutput, setDxfOutput] = useState<string>('')

  useEffect(() => {
    const {
      font,
      text,
      size = 28, // Default size
      union = true, // Default union
      filled = true, // Default filled
      kerning = true, // Default kerning
      separate = false, // Default separate
      bezierAccuracy = 0.25, // Default bezier accuracy
      units = 'mm', // Default units
      fill = '#000', // Default fill color
      stroke = '#000', // Default stroke color
      strokeWidth = '1px', // Default stroke width
      strokeNonScaling = false, // Default stroke scaling
      fillRule = 'nonzero', // Default fill rule
    } = options

    if (font === null) {
      return
    }

    debounce(() => {
      // Generate the text model using Maker.js
      const textModel: IModel = new makerjs.models.Text(font, text, size, union, false, bezierAccuracy, { kerning })

      // Separate layers if needed
      if (separate && textModel.models) {
        for (const i in textModel.models) {
          if (textModel.models[i]) {
            textModel.models[i].layer = i
          }
        }
      }

      // Generate SVG and DXF outputs
      const svg = makerjs.exporter.toSVG(textModel, {
        fill: filled ? fill : undefined,
        stroke: stroke || undefined,
        strokeWidth: strokeWidth || undefined,
        fillRule: fillRule || undefined,
        scalingStroke: !strokeNonScaling,
      })

      const dxf = makerjs.exporter.toDXF(textModel, { units, usePOLYLINE: true })

      // Update state with SVG and DXF outputs
      setSvgOutput(svg)
      setDxfOutput(dxf)
    }, 500)()
  }, [options])

  return { svgOutput, dxfOutput }
}
