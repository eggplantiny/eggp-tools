import { Editor } from '@monaco-editor/react'
import { useEffect, useState } from 'react'

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

  return (
    <Editor
      height={props.height}
      language={props.lang}
      theme="light"
      value={value}
      options={{
        readOnly: props.readOnly,
        minimap: {
          enabled: false,
        },
      }}
      onChange={handleChange}
    />
  )
}
