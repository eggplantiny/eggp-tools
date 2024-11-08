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
      size = 28,
      union = true,
      filled = true,
      kerning = true,
      separate = false,
      bezierAccuracy = 0.25,
      units = 'mm',
      fill = '#000',
      stroke = '#000',
      strokeWidth = '1px',
      strokeNonScaling = false,
      fillRule = 'nonzero',
    } = options

    if (font === null) {
      return
    }

    debounce(() => {
      const textModel: IModel = new makerjs.models.Text(font, text, size, union, false, bezierAccuracy, { kerning })

      if (separate && textModel.models) {
        for (const i in textModel.models) {
          if (textModel.models[i]) {
            textModel.models[i].layer = i
          }
        }
      }

      const svg = makerjs.exporter.toSVG(textModel, {
        fill: filled ? fill : undefined,
        stroke: stroke || undefined,
        strokeWidth: strokeWidth || undefined,
        fillRule: fillRule || undefined,
        scalingStroke: !strokeNonScaling,
      })

      const dxf = makerjs.exporter.toDXF(textModel, { units, usePOLYLINE: true })

      setSvgOutput(svg)
      setDxfOutput(dxf)
    }, 500)()
  }, [options])

  return { svgOutput, dxfOutput }
}
