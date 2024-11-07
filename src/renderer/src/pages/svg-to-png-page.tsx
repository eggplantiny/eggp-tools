import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageRootWithSplit } from '@/components/ui/layout'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import usePageMeta from '@/hooks/use-page-meta'
import { svgToPng } from '@/lib/image'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function SvgToPngPage() {
  usePageMeta({
    title: 'SVG to PNG',
  })

  const [svg, setSvg] = useState<string>('')
  const [image, setImage] = useState<string>()

  const [width, setWidth] = useState(256)
  const [height, setHeight] = useState(256)

  function onInput(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file)
      return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const svg = event.target?.result as string
      setSvg(svg)
    }
    reader.readAsText(file)
  }

  useEffect(() => {
    if (!svg)
      return
    svgToPng(svg, width, height).then(setImage)
  }, [svg, width, height])

  return (
    <PageRootWithSplit
      left={(
        <Card className="pt-4">
          <CardContent>
            <Label>
              SVG File
              <Input
                type="file"
                accept="image/svg+xml"
                onInput={onInput}
                className={cn('mt-1')}
              />
            </Label>

            <Separator className="my-4" />

            <div className={cn('flex gap-4')}>
              <Label className="grow">
                Width
                <Input
                  type="number"
                  value={width}
                  onInput={event => setWidth(Number(event.currentTarget.value))}
                  className={cn('mt-1')}
                />
              </Label>

              <Separator orientation="vertical" />

              <Label className="grow">
                Height
                <Input
                  type="number"
                  value={height}
                  onInput={event => setHeight(Number(event.currentTarget.value))}
                  className={cn('mt-1')}
                />
              </Label>
            </div>
          </CardContent>
        </Card>
      )}
      right={(
        <>
          { image && (
            <div className={cn('grid grid-cols-12 gap-4')}>
              <div className={cn('col-span-12')}>
                <Tooltip>
                  <TooltipTrigger>
                    <a href={image} download="image.png">
                      <img
                        src={image}
                        alt="SVG to PNG"
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                        }}
                      />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    Download
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ) }
        </>
      )}
    >

    </PageRootWithSplit>
  )
}
