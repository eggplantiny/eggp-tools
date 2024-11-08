import { tailwindToCss } from '@/ipc'
import { CssTransformer } from '@/lib/css.transformer'
import { HtmlClassNameTransformer } from '@/lib/html-class-name.transformer'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

async function refine(className: string, code: string) {
  const twClassName = cn(code)
  const css = await tailwindToCss(twClassName)
  const cssTransformer = new CssTransformer()

  return {
    className,
    twClassName,
    css: cssTransformer.transform(className, css),
  }
}

export function useTwHtmlConverter(html: string) {
  const [convertedHtml, setConvertedHtml] = useState<string>('')
  const [convertedCss, setConvertedCss] = useState<string>('')
  useEffect(() => {
    const transformer = new HtmlClassNameTransformer(html)

    transformer.transform()

    setConvertedHtml(transformer.getTransformedHtml())

    const classNames = transformer.getClassNameMapping()

    Promise.all(classNames.keys().map((className) => {
      const classList = classNames.get(className) ?? []
      return refine(className, classList.join(' '))
    }))
      .then((results) => {
        const css = results.map(x => x.css).join('\n\n')
        setConvertedCss(css)
      })
  }, [html])

  return {
    convertedHtml,
    convertedCss,
  }
}
