import type { VariantProps } from 'class-variance-authority'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import React from 'react'

const pageRootVariants = cva(
  'w-full h-full relative max-h-[calc(100vh-45px)] overflow-y-scroll px-4 py-4',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface PageRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof pageRootVariants> {
}

const PageRoot = React.forwardRef<HTMLDivElement, PageRootProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(pageRootVariants({ variant, className }), 'flex flex-col')}
      {...props}
    />
  ),
)

PageRoot.displayName = 'PageRoot'

const pageSubtitleVariants = cva(
  'text-lg font-semibold',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface PageSubtitleProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof pageSubtitleVariants> {
}

const PageSubtitle = React.forwardRef<HTMLDivElement, PageSubtitleProps>(
  ({ className, variant, ...props }, ref) => (
    <h2
      ref={ref}
      className={pageSubtitleVariants({ variant, className })}
      {...props}
    />
  ),
)

PageSubtitle.displayName = 'PageSubtitle'

export interface PageRootWithSplitProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof pageRootVariants> {
  left: React.ReactNode
  right: React.ReactNode
  withHandle?: boolean
}

const PageRootWithSplit = React.forwardRef<HTMLDivElement, PageRootWithSplitProps>(
  ({ className, variant, ...props }, ref) => (
    <PageRoot
      ref={ref}
      className={cn(pageRootVariants({ variant, className }), '!p-0')}
      {...props}
    >
      <ResizablePanelGroup
        direction="horizontal"
      >
        <ResizablePanel
          className={cn('p-4 flex flex-col')}
          minSize={33}
        >
          {props.left}
        </ResizablePanel>
        <ResizableHandle withHandle={props.withHandle} />
        <ResizablePanel
          className={cn('p-4 flex flex-col')}
          minSize={33}
        >
          {props.right}
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageRoot>
  ),
)

PageRootWithSplit.displayName = 'PageRootWithSplit'

export {
  PageRoot,
  pageRootVariants,
  PageRootWithSplit,
  PageSubtitle,
  pageSubtitleVariants,
}
