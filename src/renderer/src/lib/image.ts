export async function svgToPng(svg: string, width: number, height: number): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context)
    throw new Error('Failed to get canvas 2D context.')

  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      context.drawImage(img, 0, 0, width, height)

      const pngDataUrl = canvas.toDataURL('image/png')
      URL.revokeObjectURL(url)
      resolve(pngDataUrl)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG image.'))
    }
    img.src = url
  })
}
