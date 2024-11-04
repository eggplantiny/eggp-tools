import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Editor } from '@monaco-editor/react'
import { Copy } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface CodeEditorProps {
  height?: string
  readOnly?: boolean
  value?: string
  lang?: string
  onChange?: (value: string) => void
}

export function CodeEditor(props: CodeEditorProps) {
  const [value, setValue] = useState('')
  function handleChange(value: string | undefined, _event: any) {
    props.onChange?.(value ?? '')
  }

  useEffect(() => {
    if (props.value) {
      setValue(props.value)
    }
  }, [props.value])

  async function copyContent(event: React.MouseEvent<HTMLButtonElement>) {
    await navigator.clipboard.writeText(value)
    toast('Copied to clipboard 📋')

    event.stopPropagation()
  }

  return (
    <Card>
      <CardHeader>
        <div
          className={cn('flex justify-end w-full')}
        >
          <Tooltip>
            <TooltipTrigger>
              <Button size="sm" onClick={copyContent}>
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Copy to clipboard
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <Editor
          height={props.height ?? '600px'}
          language={props.lang}
          theme="light"
          value={value}
          options={{
            readOnly: props.readOnly,
            fontSize: 14,
            fontFamily: 'Pretendard Variable',
            minimap: {
              enabled: false,
            },
          }}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  )
}
