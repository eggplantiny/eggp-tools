import type { FileUrlFormSubmitParams } from '@/components/atomic/molecules/file-url-form'
import { Downloadable } from '@/components/atomic/atoms/downloadable'
import { FileUrlForm } from '@/components/atomic/molecules/file-url-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageRootWithSplit } from '@/components/ui/layout'

import { useFont } from '@/hooks/use-font'
import { useMakerJs } from '@/hooks/use-makerjs'
import usePageMeta from '@/hooks/use-page-meta'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function FontToSvgPage() {
  usePageMeta({
    title: 'Font to SVG',
  })

  const [text, setText] = useState<string>('hello world')
  const [fillColor, setFillColor] = useState<string>('#000000')
  const [strokeColor, setStrokeColor] = useState<string>('#000000')
  const [strokeWidth, setStrokeWidth] = useState<string>('1px')
  const [filled, setFilled] = useState<boolean>(true)
  const [fontSize, setFontSize] = useState<number>(28)
  const [downloadableSvgOutputUrl, setDownloadableSvgOutputUrl] = useState<string>()

  const {
    setFontUrl,
    setFontFile,
    loading,
    error,
    font,
  } = useFont()

  const { svgOutput, dxfOutput } = useMakerJs({
    font,
    text,
    size: fontSize,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth,
    filled,
  })

  useEffect(() => {
    if (downloadableSvgOutputUrl) {
      URL.revokeObjectURL(downloadableSvgOutputUrl)
    }

    if (svgOutput) {
      const blob = new Blob([svgOutput], { type: 'image/svg+xml' })
      setDownloadableSvgOutputUrl(URL.createObjectURL(blob))
    }

    return () => {
      if (downloadableSvgOutputUrl) {
        URL.revokeObjectURL(downloadableSvgOutputUrl)
      }
    }
  }, [svgOutput])

  async function onSubmit(params: FileUrlFormSubmitParams) {
    if (params.url) {
      setFontUrl(params.url)
    }
    else if (params.file) {
      setFontFile(params.file)
    }
  }

  return (
    <PageRootWithSplit
      left={(
        <div className={cn('flex flex-col gap-4')}>
          <Card
            className={cn('p-4')}
          >
            <FileUrlForm
              onSubmit={onSubmit}
              loading={loading}
              urlPlaceholder="https://example.com/font.ttf"
              fileAccept=".ttf,.otf,.woff"
            />
          </Card>

          {
            font && (
              <Card
                className={cn('p-4 grid grid-cols-2 gap-4')}
              >
                <Label>
                  Text

                  <Input
                    value={text}
                    className="mt-2.5"
                    onChange={e => setText(e.target.value)}
                    placeholder="hello world"
                  />
                </Label>

                <Label>
                  Font size

                  <Input
                    type="number"
                    className="mt-2.5"
                    value={fontSize}
                    onChange={e => setFontSize(Number(e.target.value))}
                  />
                </Label>

                <Label>
                  Fill color

                  <Input
                    type="color"
                    className="mt-2.5"
                    value={fillColor}
                    onChange={e => setFillColor(e.target.value)}
                  />
                </Label>

                <Label>
                  Stroke color

                  <Input
                    type="color"
                    className="mt-2.5"
                    value={strokeColor}
                    onChange={e => setStrokeColor(e.target.value)}
                  />
                </Label>

                <Label>
                  Stroke width

                  <Input
                    type="number"
                    className="mt-2.5"
                    value={strokeWidth}
                    onChange={e => setStrokeWidth(e.target.value)}
                  />
                </Label>

                <Label>
                  Filled

                  <Input
                    type="checkbox"
                    className="mt-4 w-6 h-6"
                    checked={filled}
                    onChange={e => setFilled(e.target.checked)}
                  />
                </Label>
              </Card>
            )
          }
        </div>
      )}
      right={(
        <>
          { error && (
            <Card className={cn('p-4 max-w-xl mx-auto')}>
              <p className={cn('text-red-500')}>{ error }</p>
            </Card>
          ) }

          {
            svgOutput
            && downloadableSvgOutputUrl
            && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    SVG Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Downloadable href={downloadableSvgOutputUrl} fileName="font.svg">
                    <div
                      dangerouslySetInnerHTML={{ __html: svgOutput }}
                      data-dxf={dxfOutput}
                    />
                  </Downloadable>
                </CardContent>
              </Card>
            )
          }
        </>
      )}
    />
  )
}
