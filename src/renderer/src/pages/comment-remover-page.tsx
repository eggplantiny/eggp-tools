import { CodeEditor } from '@/components/atomic/atoms/code-editor'
import { PageRootWithSplit } from '@/components/ui/layout'
import { useCommentRemover } from '@/hooks/use-comment-remover'
import usePageMeta from '@/hooks/use-page-meta'
import { useEffect, useState } from 'react'

export default function CommentRemoverPage() {
  usePageMeta({
    title: 'Comment Remover',
  })

  const [originalCode, setOriginalCode] = useState<string>('')
  const [cleanedCode, setCleanedCode] = useState<string>('')

  const { removeComments } = useCommentRemover()

  useEffect(() => {
    try {
      const cleaned = removeComments(originalCode, 'javascript')
      setCleanedCode(cleaned)
    }
    catch (error) {
      console.error(error)
    }
  }, [originalCode])

  return (
    <PageRootWithSplit
      left={(
        <CodeEditor
          onChange={value => setOriginalCode(value)}
        />
      )}
      leftTitle="Original code"
      right={(
        <CodeEditor
          value={cleanedCode}
          readOnly
        />
      )}
      rightTitle="Cleaned code"
    />
  )
}
