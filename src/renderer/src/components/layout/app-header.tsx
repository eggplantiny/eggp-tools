import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
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
      <header className={cn('relative flex items-center p-2 gap-2')}>
        <SidebarTrigger />

        {
          title && (
            <h1 className={cn('!text-xl text-left font-bold')}>{title}</h1>)
        }
      </header>
      <Separator />
    </>
  )
}
