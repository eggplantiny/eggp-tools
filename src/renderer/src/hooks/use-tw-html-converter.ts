import { HtmlClassNameTransformer } from '@/lib/transformers'
import { useEffect, useState } from 'react'

export function useTwHtmlConverter(html: string) {
  const [convertedHtml, setConvertedHtml] = useState<string>('')
  const [convertedCss] = useState<string>('')
  useEffect(() => {
    const transformer = new HtmlClassNameTransformer(html)

    transformer.transform()

    setConvertedHtml(transformer.getTransformedHtml())
  }, [html])

  return {
    convertedHtml,
    convertedCss,
  }
}
