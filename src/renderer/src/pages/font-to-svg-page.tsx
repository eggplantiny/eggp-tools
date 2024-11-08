import { Downloadable } from '@/components/atomic/atoms/downloadable'
import { LoadableButton } from '@/components/atomic/atoms/loadable-button'
import { HeightTransition } from '@/components/transitions/height-transition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageRootWithSplit } from '@/components/ui/layout'
import { Separator } from '@/components/ui/separator'
import { useFont } from '@/hooks/use-font'

import { useMakerJs } from '@/hooks/use-makerjs'
import usePageMeta from '@/hooks/use-page-meta'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function FontToSvgPage() {
  usePageMeta({
    title: 'Font to SVG',
  })

  const [openFontForm, setOpenFontForm] = useState<boolean>(true)
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
    clear,
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

  const formSchema = z.object({
    url: z.string().url().optional(),
    file: z.any().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: undefined,
      file: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.url && !values.file) {
      return
    }

    if (values.url) {
      setFontUrl(values.url)
    }

    if (values.file) {
      setFontFile(values.file)
    }

    setOpenFontForm(false)
  }

  return (
    <PageRootWithSplit
      left={(
        <div className={cn('flex flex-col gap-4')}>
          <Card
            className={cn('p-4')}
          >
            <HeightTransition isOpen={openFontForm}>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                >

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            {...field}
                            placeholder="https://example.com/font.ttf"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator className={cn('my-4')}>
                    or
                  </Separator>

                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".otf,.ttf,.woff"
                            onChange={e =>
                              field.onChange({ target: { value: e.target.files?.[0] ?? undefined, name: field.name } })}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className={cn('mt-4 w-full flex flex-col gap-4')}>
                    <LoadableButton
                      block
                      loading={loading}
                      type="submit"
                    >
                      Load Font
                    </LoadableButton>

                    <Button
                      block
                      type="button"
                      variant="outline"
                      onClick={() => {
                        clear()
                        form.reset()
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </Form>
            </HeightTransition>
            <HeightTransition isOpen={!openFontForm}>
              <Button
                block
                onClick={() => setOpenFontForm(true)}
              >
                Load Font
              </Button>
            </HeightTransition>
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
