import { CodeEditor } from '@/components/atomic/atoms/code-editor'
import { PageRoot, PageSubtitle } from '@/components/ui/layout'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import usePageMeta from '@/hooks/use-page-meta'
import { useTwHtmlConverter } from '@/hooks/use-tw-html-converter'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function TailwindcssToCssPage() {
  usePageMeta({
    title: 'Tailwind CSS to CSS',
  })

  const [html, setHtml] = useState(`
<ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
    <li class="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
        <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            Personal <span class="hidden sm:inline-flex sm:ms-2">Info</span>
        </span>
    </li>
    <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
        <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
            <span class="me-2">2</span>
            Account <span class="hidden sm:inline-flex sm:ms-2">Info</span>
        </span>
    </li>
    <li class="flex items-center">
        <span class="me-2">3</span>
        Confirmation
    </li>
</ol>
  `)

  const {
    convertedHtml,
    convertedCss,
  } = useTwHtmlConverter(html)

  return (
    <PageRoot>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          minSize={25}
          className={cn('p-4')}
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
          className={cn('p-4')}
          minSize={25}
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
          className={cn('p-4')}
          minSize={25}
        >
          <PageSubtitle>
            CSS
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
