import type { FileUrlFormSubmitParams } from '@/components/atomic/molecules/file-url-form'
import { ColorPalette } from '@/components/atomic/molecules/color-pallete'
import { FileUrlForm } from '@/components/atomic/molecules/file-url-form'
import { Card } from '@/components/ui/card'
import { PageRootWithSplit } from '@/components/ui/layout'
import usePageMeta from '@/hooks/use-page-meta'
import { getDominantColorPalette } from '@/lib/dominant-color'
import { cn } from '@/lib/utils'
import { InputStrategyFactory, InputType } from '@/strategies/input-strategy'
import { useCallback, useMemo, useState } from 'react'

export function DominantColorsPage() {
  usePageMeta({
    title: 'Dominant Colors',
  })

  const [loading, setLoading] = useState(false)
  const [colors, setColors] = useState<string[]>([])

  async function createImageElement(objectUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = objectUrl
      image.width = 256
    })
  }

  const fetchColors = useCallback(async (type: InputType, data: string | File) => {
    setLoading(true)
    try {
      const strategy = InputStrategyFactory.createStrategy(type as any)
      const result = await strategy.fetchData(data as any)
      const blob = new Blob([result])
      const objectUrl = URL.createObjectURL(blob) // URL 생성

      const image = await createImageElement(objectUrl)

      const extractedColors = await getDominantColorPalette(image)
      setColors(extractedColors)

      URL.revokeObjectURL(objectUrl) // URL 해제
    }
    catch (error) {
      console.error('Error fetching colors:', error)
    }
    finally {
      setLoading(false)
    }
  }, [])

  const onSubmit = useCallback(async (params: FileUrlFormSubmitParams) => {
    if (params.url)
      await fetchColors(InputType.URL, params.url)
    else if (params.file)
      await fetchColors(InputType.FILE, params.file)
  }, [fetchColors])

  const leftPanel = useMemo(() => (
    <div className={cn('flex flex-col gap-4')}>
      <Card className={cn('p-4')}>
        <FileUrlForm
          onSubmit={onSubmit}
          loading={loading}
          urlPlaceholder="Enter image URL"
          fileAccept=".png,.jpg,.jpeg,.gif,.webp"
        />
      </Card>
    </div>
  ), [onSubmit, loading])

  const rightPanel = useMemo(() => (
    colors.length > 0 && (
      <div className={cn('flex flex-col gap-4')}>
        <Card className={cn('p-4')}>
          <ColorPalette colors={colors} />
        </Card>
      </div>
    )
  ), [colors])

  return (
    <PageRootWithSplit
      left={leftPanel}
      right={rightPanel}
    />
  )
}
