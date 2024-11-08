import type { FileUrlFormSubmitParams } from '@/components/atomic/molecules/file-url-form'
import { ColorPalette } from '@/components/atomic/molecules/color-pallete'
import { FileUrlForm } from '@/components/atomic/molecules/file-url-form'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { PageRootWithSplit } from '@/components/ui/layout'
import usePageMeta from '@/hooks/use-page-meta'
import { getDominantColorPalette } from '@/lib/dominant-color'
import { cn } from '@/lib/utils'
import { InputStrategyFactory, InputType } from '@/strategies/input-strategy'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function DominantColorsPage() {
  usePageMeta({
    title: 'Dominant Colors',
  })

  const [loading, setLoading] = useState(false)
  const [colors, setColors] = useState<string[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  async function createImageElement(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = url
      image.width = 256
    })
  }

  const fetchColors = useCallback(async (type: InputType, data: string | File) => {
    setLoading(true)
    try {
      // Fetch the data as an ArrayBuffer (both for URL and File)
      const strategy = InputStrategyFactory.createStrategy(type as any)
      const result = await strategy.fetchData(data as any)
      const blob = new Blob([result])
      const objectUrl = URL.createObjectURL(blob)

      // Update preview and clean up any previous URLs
      setPreviewUrl((prev) => {
        if (prev)
          URL.revokeObjectURL(prev) // Clean up previous URL if present
        return objectUrl
      })

      // Create an image element from the blob URL and extract colors
      const image = await createImageElement(objectUrl)
      const extractedColors = await getDominantColorPalette(image)
      setColors(extractedColors)
    }
    catch (error) {
      console.error('Error fetching colors:', error)
    }
    finally {
      setLoading(false)
    }
  }, [])

  const onSubmit = useCallback(async (params: FileUrlFormSubmitParams) => {
    if (params.url) {
      await fetchColors(InputType.URL, params.url) // Process URL as ArrayBuffer
    }
    else if (params.file) {
      await fetchColors(InputType.FILE, params.file) // Process file as ArrayBuffer
    }
  }, [fetchColors])

  // Cleanup when component unmounts or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl)
        URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

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
      {previewUrl && (
        <Card className={cn('p-4 w-fit')}>
          <Label>
            Image Preview
            <img src={previewUrl} alt="Image Preview" className="w-64 mt-2 h-auto rounded-md" />
          </Label>
        </Card>
      ) }
    </div>
  ), [onSubmit, loading, previewUrl])

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
