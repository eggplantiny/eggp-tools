import type {
  BundledLanguageInfo,
  BundledThemeInfo,
  HighlighterGeneric,
} from 'shiki'
import { useEffect, useMemo, useState } from 'react'

export function useCodeEditor() {
  const [lang, setLang] = useState('html')
  const [theme, setTheme] = useState('synthwave-84')

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('<pre></pre>')
  const [preStyle, setPreStyle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [allThemes, setAllThemes] = useState<BundledThemeInfo[]>(() => [
    {
      id: 'viteesse',
      displayName: 'Viteesse',
      type: 'light',
      import: undefined!,
    },
  ])

  const [allLanguages, setAllLanguages] = useState<BundledLanguageInfo[]>(() => [
    {
      id: 'html',
      name: 'HTML',
      import: undefined!,
    },
  ])

  const [_bundledLanguagesFull, setBundledLanguagesFull] = useState<BundledLanguageInfo[]>(() => [])
  const [_bundledLanguagesWeb, setBundledLanguagesWeb] = useState<BundledLanguageInfo[]>(() => [])

  const [highlighter, setHighlighter] = useState<HighlighterGeneric<any, any> | null>(null)

  const currentThemeType = useMemo(() => {
    return allThemes.find(t => t.id === theme)?.type || 'inherit'
  }, [theme, allThemes])

  async function initializeShiki() {
    const { createHighlighter } = await import('shiki')
    const { bundledLanguagesInfo: bundleFull } = await import('shiki/bundle/full')
    const { bundledLanguagesInfo: bundleWeb } = await import('shiki/bundle/web')
    const { bundledThemesInfo } = await import('shiki/themes')

    setAllThemes(() => bundledThemesInfo)
    setAllLanguages(() => bundleFull)
    setBundledLanguagesFull(() => bundleFull)
    setBundledLanguagesWeb(() => bundleWeb)

    if (typeof window === 'undefined') {
      return
    }

    const highlighter = await createHighlighter({
      themes: [theme],
      langs: ['typescript', 'javascript', 'html', lang],
    })

    setHighlighter(highlighter)
    return highlighter
  }

  function run() {
    if (!highlighter) {
      return
    }
    const result = highlighter.codeToHtml(input, {
      lang,
      theme,
      transformers: [
        {
          preprocess(code) {
            if (code.endsWith('\n'))
              return `${code}\n`
            return code
          },
          pre(node) {
            this.addClassToHast(node, 'vp-code')
            setPreStyle(node.properties?.style as string || '')
          },
        },
      ],
    })
    setOutput(result)
  }

  async function loadHighlighter() {
    setIsLoading(true)
    let _highlighter = highlighter

    if (!_highlighter) {
      _highlighter = (await initializeShiki())!
    }

    console.log(_highlighter)

    await Promise.all([
      _highlighter.loadTheme(theme),
      _highlighter.loadLanguage(lang),
    ])

    run()
    setIsLoading(false)
  }

  useEffect(() => {
    run()
  }, [input])

  useEffect(() => {
    loadHighlighter()
  }, [lang, theme])

  return {
    lang,
    setLang,
    theme,
    setTheme,
    input,
    setInput,
    output,
    preStyle,
    isLoading,
    allThemes,
    allLanguages,
    currentThemeType,
  }
}

if (import.meta.hot)
  import.meta.hot.accept()
