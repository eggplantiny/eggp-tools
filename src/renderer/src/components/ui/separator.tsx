import { cn } from '@/lib/utils'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import * as React from 'react'

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', children, decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border relative',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...props}
    >
      {children && (
        <span className="text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-border-100 px-2 bg-bg">{children}</span>
      )}
    </SeparatorPrimitive.Root>
  ),
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
