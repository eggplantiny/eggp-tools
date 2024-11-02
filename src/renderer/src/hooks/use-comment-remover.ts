import { useCallback, useState } from 'react'

type CommentRemover = (code: string) => string

interface CommentPlugins {
  [language: string]: CommentRemover
}

const defaultPlugins: CommentPlugins = {
  javascript: code => code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim(),
  python: code => code.replace(/#.*/g, '').trim(),
  html: code => code.replace(/<!--[\s\S]*?-->/g, '').trim(),
  css: code => code.replace(/\/\*[\s\S]*?\*\//g, '').trim(),
  markdown: code => code.replace(/<!--[\s\S]*?-->/g, '').trim(),
}

export function useCommentRemover(initialPlugins: CommentPlugins = {}) {
  const [plugins, setPlugins] = useState<CommentPlugins>({
    ...defaultPlugins,
    ...initialPlugins,
  })

  const addPlugin = useCallback((language: string, remover: CommentRemover) => {
    setPlugins(prevPlugins => ({
      ...prevPlugins,
      [language]: remover,
    }))
  }, [])

  const removeComments = useCallback(
    (code: string, language: string): string => {
      const remover = plugins[language]
      if (!remover) {
        throw new Error(`Unsupported language: ${language}`)
      }
      return remover(code)
    },
    [plugins],
  )

  return { removeComments, addPlugin }
}
