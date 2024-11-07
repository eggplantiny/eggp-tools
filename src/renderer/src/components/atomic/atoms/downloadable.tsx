import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'

interface Props {
  href: string
  fileName: string
  children: React.ReactNode
}
export function Downloadable(props: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <a
          href={props.href}
          download={props.fileName}
          className="block p-2 hover:bg-gray-100"
        >
          { props.children }
        </a>
      </TooltipTrigger>
      <TooltipContent>
        Download
      </TooltipContent>
    </Tooltip>
  )
}
