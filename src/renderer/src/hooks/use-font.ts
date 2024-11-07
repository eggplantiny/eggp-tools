import type { InputStrategy } from '@/strategies/output-strategy'
import { InputStrategyFactory, InputType } from '@/strategies/input-strategy'
import { parse } from 'opentype.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useFont() {
  const [loading, setLoading] = useState(false)
  const [fontFile, setFontFile] = useState<File | null>(null)
  const [fontUrl, setFontUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [fontData, setFontData] = useState<ArrayBuffer | null>(null)

  const fetchData = useCallback(async (input: File | string) => {
    setLoading(true)
    let inputStrategy: InputStrategy<any> | null = null

    if (input instanceof File) {
      inputStrategy = InputStrategyFactory.createStrategy(InputType.FILE)
    }

    if (typeof input === 'string') {
      inputStrategy = InputStrategyFactory.createStrategy(InputType.URL)
    }

    if (!inputStrategy) {
      throw new Error('Invalid input')
    }

    const data = await inputStrategy.fetchData(input)

    setFontData(data)
    setLoading(false)
  }, [])

  const font = useMemo(() => {
    if (!fontData) {
      return null
    }
    const font = parse(fontData)
    return font
  }, [fontData])

  const isFetched = useMemo(() => !!font, [font])

  useEffect(() => {
    if (fontFile) {
      fetchData(fontFile)
        .catch((error) => {
          setError(error.message)
        })
    }

    if (fontUrl) {
      fetchData(fontUrl)
        .catch((error) => {
          setError(error.message)
        })
    }
  }, [fontFile, fontUrl])

  function clear() {
    setFontFile(null)
    setFontUrl(null)
    setFontData(null)
    setError(null)
  }

  return {
    loading,
    setFontUrl,
    setFontFile,
    fontData,
    isFetched,
    error,
    clear,
    font,
  }
}
