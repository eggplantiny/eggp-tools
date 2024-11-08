import { calculateCentroid, euclideanDistance } from '@/lib/code'

export function getDominantColorsFromImage(
  image: HTMLImageElement,
  colorCount: number = 5,
  iterations: number = 10,
): string[] {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context)
    throw new Error('Failed to get canvas context')

  canvas.width = image.width
  canvas.height = image.height
  context.drawImage(image, 0, 0)

  const imageData = context.getImageData(0, 0, image.width, image.height)
  const pixels = imageData.data

  const centroids: number[][] = Array.from({ length: colorCount }, () =>
    [Math.random() * 255, Math.random() * 255, Math.random() * 255])

  for (let iter = 0; iter < iterations; iter++) {
    const clusters: number[][][] = Array.from({ length: colorCount }, () => [])

    for (let i = 0; i < pixels.length; i += 4) {
      const color = [pixels[i], pixels[i + 1], pixels[i + 2]]
      let closestCentroidIndex = 0
      let minDistance = Infinity

      for (let j = 0; j < colorCount; j++) {
        const distance = euclideanDistance(color, centroids[j])
        if (distance < minDistance) {
          minDistance = distance
          closestCentroidIndex = j
        }
      }
      clusters[closestCentroidIndex].push(color)
    }

    for (let j = 0; j < colorCount; j++) {
      if (clusters[j].length === 0)
        continue
      centroids[j] = calculateCentroid(clusters[j])
    }
  }

  return centroids.map(
    color => `rgb(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])})`,
  )
}
