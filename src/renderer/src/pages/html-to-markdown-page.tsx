import CodeEditor from '@/components/atomic/atoms/code-editor'
import { PageRootWithSplit } from '@/components/ui/layout'
import usePageMeta from '@/hooks/use-page-meta'
import { useEffect, useState } from 'react'

export function HtmlToMarkdownPage() {
  usePageMeta({
    title: 'HTML to Markdown',
  })

  const [html, setHtml] = useState<string>('')
  const [markdown, setMarkdown] = useState<string>('')

  useEffect(() => {
    window.electron.ipcRenderer.invoke('html-to-markdown', html)
      .then((md: string) => {
        setMarkdown(md)
      })
  }, [html])

  return (
    <PageRootWithSplit
      left={(
        <>
          <CodeEditor
            title="HTML"
            lang="html"
            clearable
            onChange={value => setHtml(value)}
          />
        </>
      )}

      right={(
        <>
          <CodeEditor
            title="Markdown"
            value={markdown}
            readOnly
          />
        </>
      )}
    />
  )
}
