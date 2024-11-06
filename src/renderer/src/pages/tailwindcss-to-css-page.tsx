import CodeEditor from '@/components/atomic/atoms/code-editor'
import { PageRoot, PageSubtitle } from '@/components/ui/layout'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import usePageMeta from '@/hooks/use-page-meta'
import { useLocalStorage } from '@/hooks/use-storage'
import { useTwHtmlConverter } from '@/hooks/use-tw-html-converter'
import { cn } from '@/lib/utils'

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
    <PageRoot>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          minSize={10}
          className={cn('p-4 flex flex-col')}
        >
          <PageSubtitle>
            HTML
          </PageSubtitle>
          <CodeEditor
            lang="html"
            value={html}
            onChange={value => setHtml(value)}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          className={cn('p-4 flex flex-col relative')}
          minSize={10}
        >
          <PageSubtitle>
            Converted HTML
          </PageSubtitle>
          <CodeEditor
            lang="html"
            value={convertedHtml}
            readOnly
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          className={cn('p-4 flex flex-col')}
          minSize={10}
        >
          <PageSubtitle>
            Converted CSS
          </PageSubtitle>
          <CodeEditor
            value={convertedCss}
            lang="css"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageRoot>
  )
}
