import CodeEditor from '@/components/atomic/atoms/code-editor'
import { PageRootWithSplit } from '@/components/ui/layout'
import { useCommentRemover } from '@/hooks/use-comment-remover'
import usePageMeta from '@/hooks/use-page-meta'
import { useSessionStorage } from '@/hooks/use-storage'
import { useEffect, useState } from 'react'

export function CommentRemoverPage() {
  usePageMeta({
    title: 'Comment Remover',
  })

  const [originalCode, setOriginalCode] = useSessionStorage<string>('comment-remover:original-code', '')
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
        <>
          <CodeEditor
            title="Code with comments"
            clearable
            value={originalCode}
            onChange={value => setOriginalCode(value)}
          />
        </>
      )}
      right={(
        <>
          <CodeEditor
            title="Code without comments"
            value={cleanedCode}
            readOnly
          />
        </>
      )}
    />
  )
}
