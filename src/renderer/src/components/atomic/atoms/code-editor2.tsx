import { usePlayground } from '@/hooks/use-playground'
import { cn, parseStyleString } from '@/lib/utils'
import { useCallback, useEffect, useRef } from 'react'

interface Props {
  readOnly?: boolean
  value?: string
  lang?: string
  onChange?: (value: string) => void
}

export default function CodeEditor2(props: Props) {
  const play = usePlayground({
    lang: props.lang ?? 'typescript',
  })

  const currentThemeType = play.allThemes.find(i => i.id === play.theme)?.type || 'inherit'

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const highlightContainerRef = useRef<HTMLSpanElement>(null)

  const syncScroll = useCallback(() => {
    if (!highlightContainerRef.current || !textAreaRef.current)
      return
    const preEl = highlightContainerRef.current.children[0] as HTMLPreElement
    if (!preEl)
      return

    preEl.scrollLeft = textAreaRef.current.scrollLeft
  }, [])

  const onInput = () => {
    setTimeout(() => {
      syncScroll()
    }, 0)
  }

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (props.readOnly)
      return
    if (props.onChange)
      props.onChange(e.target.value)

    play.setInput(e.target.value)
  }

  useEffect(() => {
    if (props.value)
      play.setInput(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.lang)
      play.setLang(props.lang)
  }, [play.lang])

  useEffect(() => {
    syncScroll()
  }, [syncScroll, play.output])

  return (
    <div
      className={cn(
        'transition-none',
        'shadow',
        'grow',
      )}
      style={{
        ...parseStyleString(play.preStyle),
        colorScheme: currentThemeType,
      }}
    >
      <div className="relative h-full min-h-[100px]">
        <div className={cn('py-5', 'h-full', 'px-6')}>
          <span
            ref={highlightContainerRef}
            dangerouslySetInnerHTML={{ __html: play.output }}
          />
        </div>
        <textarea
          ref={textAreaRef}
          value={play.input}
          onChange={onChange}
          onInput={onInput}
          onScroll={syncScroll}
          className={cn(
            'whitespace-pre',
            'overflow-auto',
            'w-full',
            'h-full',
            'bg-transparent',
            'absolute',
            'inset-0',
            'py-5',
            'px-6',
            'text-transparent',
            'caret-gray-500',
            'tab-size-[4]',
            'text-[16px]',
            'leading-6',
            'resize-none',
            'z-10',
          )}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  )
}
