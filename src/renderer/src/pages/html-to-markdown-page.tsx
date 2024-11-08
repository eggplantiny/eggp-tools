import CodeEditor from '@/components/atomic/atoms/code-editor'
import { PageRootWithSplit } from '@/components/ui/layout'
import usePageMeta from '@/hooks/use-page-meta'
import { htmlToMarkdown } from '@/ipc'
import { useEffect, useState } from 'react'

export function HtmlToMarkdownPage() {
  usePageMeta({
    title: 'HTML to Markdown',
  })

  const [html, setHtml] = useState<string>('')
  const [markdown, setMarkdown] = useState<string>('')

  useEffect(() => {
    htmlToMarkdown(html)
      .then(result => setMarkdown(result))
      .catch(error => console.error(error))
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
