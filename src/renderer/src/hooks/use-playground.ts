import type { BundledLanguageInfo, BundledThemeInfo } from '@shikijs/types'
import { useEffect, useRef, useState } from 'react'

interface Props {
  lang: string
}

export function usePlayground(props: Props) {
  const [theme, setTheme] = useState<string>('synthwave-84')

  const [allThemes, setAllThemes] = useState<BundledThemeInfo[]>([
    {
      id: 'synthwave-84',
      displayName: 'Synthwave 84',
      type: 'dark',
      import: undefined!,
    },
  ])

  const [allLanguages, setAllLanguages] = useState<BundledLanguageInfo[]>([
    {
      id: 'typescript',
      name: 'TypeScript',
      import: undefined!,
    },
  ])

  const [bundledLangsFull, setBundledLangsFull] = useState<BundledLanguageInfo[]>([])
  const [bundledLangsWeb, setBundledLangsWeb] = useState<BundledLanguageInfo[]>([])

  const [lang, setLang] = useState<string>(props.lang)
  const [input, setInput] = useState<string>('')
  const [output, setOutput] = useState<string>('<pre></pre>')
  const [preStyle, setPreStyle] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const highlighterRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { createHighlighter } = await import('shiki')
        const { bundledLanguagesInfo: bundleFull } = await import('shiki/bundle/full')
        const { bundledLanguagesInfo: bundleWeb } = await import('shiki/bundle/web')
        const { bundledThemesInfo } = await import('shiki/themes')

        if (!mounted)
          return

        setAllThemes(bundledThemesInfo)
        setAllLanguages(bundleFull)
        setBundledLangsFull(bundleFull)
        setBundledLangsWeb(bundleWeb)

        const highlighter = await createHighlighter({
          themes: [theme],
          langs: ['typescript', 'javascript', lang],
        })

        highlighterRef.current = highlighter
        setIsLoading(false)
      }
      catch (error) {
        console.error(error)
        setIsLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [props.lang])

  useEffect(() => {
    if (!highlighterRef.current)
      return

    const updateHighlighter = async () => {
      setIsLoading(true)
      try {
        const highlighter = highlighterRef.current
        await Promise.all([
          highlighter.loadTheme(theme),
          highlighter.loadLanguage(lang),
        ])

        setIsLoading(false)
      }
      catch (error) {
        console.error(error)
        setIsLoading(false)
      }
    }

    updateHighlighter()
  }, [lang, theme])

  useEffect(() => {
    if (!highlighterRef.current || isLoading)
      return

    const run = () => {
      const highlighter = highlighterRef.current
      const result = highlighter.codeToHtml(input, {
        lang,
        theme,
        transformers: [
          {
            preprocess(code: string) {
              if (code.endsWith('\n')) {
                return `${code}\n`
              }
              return code
            },
            pre(node: any) {
              if (node.properties) {
                node.properties.className = [
                  ...(node.properties.className || []),
                ]
                setPreStyle(node.properties.style || '')
              }
            },
          },
        ],
      })
      setOutput(result)
    }

    run()
  }, [input, lang, theme, isLoading])

  return {
    lang,
    setLang,
    theme,
    setTheme,
    allLanguages,
    allThemes,
    bundledLangsFull,
    bundledLangsWeb,
    input,
    setInput,
    output,
    isLoading,
    preStyle,
  }
}
