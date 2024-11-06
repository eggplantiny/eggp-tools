import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'

interface Props {
  label: string
  leftAction: () => void
  rightAction: () => void
}

export function CommandController(props: Props) {
  return (
    <div className={cn('w-full flex items-center justify-between')}>
      <Button
        size="icon"
        variant="outline"
        onClick={(e) => {
          props.leftAction()
          e.stopPropagation()
        }}
      >
        <Minus />
      </Button>

      <span className={cn('text-sm font-bold')}>{props.label}</span>

      <Button
        size="icon"
        variant="outline"
        onClick={(e) => {
          props.rightAction()
          e.stopPropagation()
        }}
      >
        <Plus />
      </Button>
    </div>
  )
}
