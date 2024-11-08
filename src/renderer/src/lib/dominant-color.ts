import Vibrant from 'node-vibrant'

export async function getDominantColorPalette(image: HTMLImageElement): Promise<string[]> {
  try {
    const palette = await Vibrant.from(image).getPalette()
    return Object.values(palette).map(x => x?.hex).filter(color => color) as string[]
  }
  catch (error) {
    console.error('Failed to get palette:', error)
    return []
  }
}
