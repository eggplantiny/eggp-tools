import { CodeEditor } from '@/components/atomic/atoms/code-editor'
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
        console.log(md)
        setMarkdown(md)
      })
  }, [html])

  return (
    <PageRootWithSplit
      left={(
        <CodeEditor
          lang="html"
          onChange={value => setHtml(value)}
        />
      )}

      right={(
        <CodeEditor
          lang="markdown"
          value={markdown}
          readOnly
        />
      )}

      leftTitle="HTML"
      rightTitle="Markdown"
    />
  )
}
