import { Input } from '@/components/ui/input'
import { PageRoot } from '@/components/ui/layout'
import usePageMeta from '@/hooks/use-page-meta'
import { useSessionStorage } from '@/hooks/use-storage'
import { svgToPng } from '@/lib/image'
import { useState } from 'react'

export function SvgToPngPage() {
  usePageMeta({
    title: 'SVG to PNG',
  })

  const [_svg, setSvg] = useSessionStorage<string>('svg-to-png:svg', '')
  const [image, setImage] = useState<string>()

  function onInput(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file)
      return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const svg = event.target?.result as string
      setSvg(svg)

      const _image = await svgToPng(svg, 256, 256)
      setImage(_image)
    }
    reader.readAsText(file)
  }

  return (
    <PageRoot>
      <Input
        type="file"
        accept="image/svg+xml"
        onInput={onInput}
      />

      {image && (
        <img src={image} alt="SVG to PNG" className="w-64 h-64" />
      )}
    </PageRoot>
  )
}
