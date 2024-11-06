import CodeEditor from '@/components/atomic/atoms/code-editor'
import { PageRootWithSplit, PageSubtitle } from '@/components/ui/layout'
import { useCommentRemover } from '@/hooks/use-comment-remover'
import usePageMeta from '@/hooks/use-page-meta'
import { useSessionStorage } from '@/hooks/use-storage'
import { useEffect, useState } from 'react'

export default function CommentRemoverPage() {
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
          <PageSubtitle>
            Code with comments
          </PageSubtitle>
          <CodeEditor
            value={originalCode}
            onChange={value => setOriginalCode(value)}
          />
        </>
      )}
      right={(
        <>
          <PageSubtitle>
            Code without comments
          </PageSubtitle>
          <CodeEditor
            value={cleanedCode}
            readOnly
          />
        </>
      )}
    />
  )
}
