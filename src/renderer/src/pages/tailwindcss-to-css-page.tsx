import CodeEditor from '@/components/atomic/atoms/code-editor'
import { PageRootWithSplit } from '@/components/ui/layout'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import usePageMeta from '@/hooks/use-page-meta'
import { useLocalStorage } from '@/hooks/use-storage'
import { useTwHtmlConverter } from '@/hooks/use-tw-html-converter'

export default function TailwindcssToCssPage() {
  usePageMeta({
    title: 'Tailwind CSS to CSS',
  })

  const [html, setHtml] = useLocalStorage('tailwindcss-to-css:html', '')

  const {
    convertedHtml,
    convertedCss,
  } = useTwHtmlConverter(html)

  return (
    <PageRootWithSplit
      left={(
        <>
          <CodeEditor
            lang="html"
            clearable
            title="HTML with Tailwind CSS classes"
            value={html}
            onChange={value => setHtml(value)}
          />
        </>
      )}
      right={(
        <>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              minSize={10}
            >
              <CodeEditor
                title="Converted HTML"
                lang="html"
                value={convertedHtml}
                readOnly
              />
            </ResizablePanel>
            <ResizableHandle className="my-4" />
            <ResizablePanel
              minSize={10}
            >
              <CodeEditor
                title="Converted CSS"
                value={convertedCss}
                readOnly
                lang="css"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </>
      )}
    >
    </PageRootWithSplit>
  )
}
