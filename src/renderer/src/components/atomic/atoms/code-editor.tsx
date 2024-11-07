import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { usePlayground } from '@/hooks/use-playground'
import { cn, parseStyleString } from '@/lib/utils'
import { Copy, Trash } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface Props {
  title?: string
  readOnly?: boolean
  clearable?: boolean
  value?: string
  lang?: string
  onChange?: (value: string) => void
}

export default function CodeEditor(props: Props) {
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

    const codeEl = preEl.children[0] as HTMLSpanElement

    if (!codeEl)
      return

    const x = textAreaRef.current.scrollLeft
    const y = textAreaRef.current.scrollTop

    preEl.scrollLeft = x
    preEl.scrollTop = y
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

    e.stopPropagation()
  }

  function onClickCopy(e: React.MouseEvent<HTMLButtonElement>) {
    navigator.clipboard.writeText(play.input)
    toast(`Copied ${props.title ?? 'code'} 📋`)
    e.stopPropagation()
  }

  function onClickClear(e: React.MouseEvent<HTMLButtonElement>) {
    if (props.readOnly)
      return
    if (props.onChange)
      props.onChange('')
    play.setInput('')
    toast('Cleared code 🧹')
    e.stopPropagation()
  }

  useEffect(() => {
    play.setInput(props.value ?? '')
  }, [props.value])

  useEffect(() => {
    if (props.lang)
      play.setLang(props.lang)
  }, [play.lang])

  useEffect(() => {
    syncScroll()
  }, [syncScroll, play.output])

  return (
    <Card className={cn('w-full h-full flex flex-col')}>
      <CardHeader className={cn('flex flex-row items-center justify-between px-4 py-2')}>
        <CardTitle className={cn('text-md')}>
          {props.title}
        </CardTitle>

        <div className={cn('flex gap-2')}>
          {props.clearable && !props.readOnly && (
            <Button
              variant="outline"
              size="icon"
              onClick={onClickClear}
            >
              <Trash />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={onClickCopy}
          >
            <Copy />
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <div
        className={cn(
          'transition-none',
          'shadow',
          'grow',
          'rounded-lg',
          'overflow-hidden',
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
              'tab-size-4',
              'text-sm',
              'leading-6',
              'font-pretendard',
              'resize-none',
              'z-10',
              'focus:outline-none',
            )}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      </div>
    </Card>
  )
}
