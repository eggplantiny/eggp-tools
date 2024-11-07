import type { ButtonProps } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface Props extends ButtonProps {
  loading: boolean
}

export function LoadableButton(props: Props) {
  const { loading, children, ...rest } = props
  return (
    <Button
      {...rest}
      disabled={loading}
      className={cn('relative', props.className)}
    >
      {
        loading && (<Loader2 className="animate-spin mr-2" />)
      }
      {props.children}
    </Button>
  )
}
