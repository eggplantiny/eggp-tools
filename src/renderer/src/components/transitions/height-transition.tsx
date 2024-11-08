import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Props {
  isOpen: boolean
  children: React.ReactNode
  className?: string
}

export function HeightTransition({ isOpen, children, className }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        height: { duration: 0.3, ease: 'easeInOut' },
        opacity: { delay: 0.3, duration: 0.3, ease: 'easeInOut' },
      }}
      style={{ overflow: 'hidden' }}
      className={cn('relative', className)}
    >
      {children}
    </motion.div>
  )
}
