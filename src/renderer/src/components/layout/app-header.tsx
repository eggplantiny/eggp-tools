import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function AppHeader() {
  const [title, setTitle] = useState('')

  useEffect(() => {
    // watch document.title
    const observer = new MutationObserver(() => {
      setTitle(document.title)
    })
    observer.observe(document.querySelector('title')!, {
      childList: true,
      subtree: true,
    })
  }, [])

  return (
    <>
      <header className={cn('electron-draggable relative flex justify-center items-center p-2 gap-2')}>
        {
          title && (
            <h1 className={cn('!text-sm text-left font-bold')}>{title}</h1>)
        }
      </header>
      <Separator />
    </>
  )
}
