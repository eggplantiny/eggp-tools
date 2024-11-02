import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageRoot } from '@/components/ui/layout'

import usePageMeta from '@/hooks/use-page-meta'
import { useSessionStorage } from '@/hooks/use-storage'
import { cn } from '@/lib/utils'

import * as chroma from 'chroma.ts'
import { Pipette } from 'lucide-react'
import { useCallback } from 'react'

interface ColorItem {
  name: string
  colorFormat: chroma.ColorFormat | 'keyword' | 'rgba'
  readOnly?: boolean
  color: string
}

interface ColorParser {
  test?: (val: string) => boolean
  regex?: RegExp
  mode?: chroma.ColorFormat
  parse: (val: string) => chroma.Color
  parseComponents?: (components: string) => number[]
}

interface ColorCommand {
  label: string
  action: (color: chroma.Color) => string
}

export function ColorToolPage() {
  usePageMeta({
    title: 'Color Tool',
  })

  const [pickerColor, setPickerColor] = useSessionStorage<string>('color-tool:pickerColor', '#000000')
  const [hex, setHex] = useSessionStorage<string>('color-tool:hex', '')
  const [rgb, setRgb] = useSessionStorage<string>('color-tool:rgb', '')
  const [rgba, setRgba] = useSessionStorage<string>('color-tool:rgba', '')
  const [cmyk, setCmyk] = useSessionStorage<string>('color-tool:cmyk', '')
  const [hsl, setHsl] = useSessionStorage<string>('color-tool:hsl', '')
  const [hsv, setHsv] = useSessionStorage<string>('color-tool:hsv', '')
  const [keyword, setKeyword] = useSessionStorage<string>('color-tool:keyword', '')

  const colors: ColorItem[] = [
    {
      name: 'HEX',
      colorFormat: 'hex',
      color: hex,
    },
    {
      name: 'RGB',
      colorFormat: 'rgb',
      color: rgb,
    },
    {
      name: 'RGBA',
      colorFormat: 'rgba',
      color: rgba,
    },
    {
      name: 'CMYK',
      colorFormat: 'cmyk',
      color: cmyk,
    },
    {
      name: 'HSL',
      colorFormat: 'hsl',
      color: hsl,
    },
    {
      name: 'HSV',
      colorFormat: 'hsv',
      color: hsv,
    },
    {
      name: 'Keyword',
      colorFormat: 'keyword',
      color: keyword,
      readOnly: true,
    },
  ]

  const colorCommands: ColorCommand[] = [
    {
      label: 'Darken',
      action: color => color.darker().hex('rgb'),
    },
    {
      label: 'Lighten',
      action: color => color.brighter().hex('rgb'),
    },
    {
      label: 'Saturate',
      action: color => color.saturate().hex('rgb'),
    },
    {
      label: 'Desaturate',
      action: color => color.desaturate().hex('rgb'),
    },
    {
      label: 'Alpha',
      action: color => color.alpha(0.5).hex('rgba'),
    },
  ]

  const syncColors = useCallback((value: string) => {
    let color: chroma.Color | null = null

    const colorParsers = [
      {
        test: (val: string) => val.startsWith('#'),
        parse: (val: string) => {
          try {
            return chroma.color(val, 'hex')
          }
          catch {
            return chroma.color(val)
          }
        },
      },
      {
        regex: /^cmyk\(([^)]+)\)$/,
        mode: 'cmyk',
        parseComponents: (components: string) =>
          components
            .split(' ')
            .map(x => Number.parseFloat(x.replace('%', '')) / 100),
      },
      {
        regex: /^rgb\(([^)]+)\)$/,
        mode: 'rgb',
        parseComponents: (components: string) =>
          components.split(' ').map(x => Number.parseInt(x, 10)),
      },
      {
        regex: /^rgba\(([^)]+)\)$/,
        mode: 'rgb',
        parseComponents: (components: string) =>
          components.split(' ').map(x =>
            x.includes('%')
              ? Number.parseFloat(x.replace('%', '')) / 100
              : Number.parseInt(x, 10),
          ),
      },
      {
        regex: /^hsl\(([^)]+)\)$/,
        mode: 'hsl',
        parseComponents: (components: string) =>
          components.split(' ').map(x =>
            x.includes('%')
              ? Number.parseFloat(x.replace('%', '')) / 100
              : Number.parseInt(x, 10),
          ),
      },
      {
        regex: /^hsv\(([^)]+)\)$/,
        mode: 'hsv',
        parseComponents: (components: string) =>
          components.split(' ').map(x =>
            x.includes('%')
              ? Number.parseFloat(x.replace('%', '')) / 100
              : Number.parseInt(x, 10),
          ),
      },
    ] as ColorParser[]

    for (const parser of colorParsers) {
      if (parser.test && parser.test(value)) {
        color = parser.parse(value)
        break
      }
      else if (parser.regex) {
        const matches = value.match(parser.regex)
        if (matches) {
          const components = parser.parseComponents?.(matches[1])
          if (!components) {
            break
          }
          color = chroma.color(components, parser.mode)
          break
        }
      }
    }

    if (!color) {
      setHex(value)
    }
    else {
      setPickerColor(color.hex())
      setHex(color.hex('rgba'))
      setRgb(`rgb(${color.rgb().join(' ')})`)
      setRgba(
        `rgba(${color
          .rgba()
          .map((x, i) =>
            i === 3 ? `${Math.round(x * 100)}%` : Math.round(x),
          )
          .join(' ')})`,
      )
      setCmyk(
        `cmyk(${color
          .cmyk()
          .map(x => `${Math.round(x * 100)}%`)
          .join(' ')})`,
      )
      setHsl(
        `hsl(${color
          .hsl()
          .map((x, i) =>
            i === 1 || i === 2 ? `${Math.round(x * 100)}%` : Math.round(x),
          )
          .join(' ')})`,
      )
      setHsv(
        `hsv(${color
          .hsv()
          .map((x, i) =>
            i === 1 || i === 2 ? `${Math.round(x * 100)}%` : Math.round(x),
          )
          .join(' ')})`,
      )
      setKeyword(color.name(true))
    }
  }, [])

  async function handleClick() {
    const eyeDropper = new window.EyeDropper()

    const result = await eyeDropper.open()

    syncColors(result.sRGBHex)
  }

  return (
    <PageRoot>
      <div className={cn('flex flex-col gap-2')}>
        <div className="w-full flex justify-end gap-2">
          { colorCommands.map(({ label, action }) => (
            <Button
              onClick={() => syncColors(action(chroma.color(pickerColor)))}
              className={cn('rounded-full')}
              key={label}
            >
              { label }
            </Button>
          )) }

          <Button onClick={handleClick} className={cn('rounded-full')}>
            <Pipette />
            { ' ' }
            Pick a color
          </Button>
        </div>

        <div className={cn('grid grid-cols-12 gap-2')}>
          <div className={cn('col-span-12 md:col-span-6')}>
            <Label>
              Color
              <Input
                type="color"
                value={pickerColor}
                onChange={(e) => {
                  setPickerColor(e.target.value)
                  syncColors(e.target.value)
                }}
              />
            </Label>
          </div>
          {colors.map(({ name, color, readOnly }) => (
            <div className={cn('col-span-12 md:col-span-6')} key={name}>
              <Label>
                {name}
                <Input
                  value={color}
                  readOnly={readOnly}
                  onChange={e => syncColors(e.target.value)}
                />
              </Label>
            </div>
          ))}
        </div>

      </div>
    </PageRoot>
  )
}
