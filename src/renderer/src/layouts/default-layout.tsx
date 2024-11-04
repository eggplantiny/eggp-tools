import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import BlurFade from '@/components/ui/blur-fade'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export default function DefaultLayout() {
  const location = useLocation()

  const currentKey = useMemo(() => location.pathname, [location])
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className={cn('relative w-full overflow-y-hidden')}>
        <Toaster />

        <AppHeader />
        <BlurFade
          className={cn('w-full h-full')}
          yOffset={0}
        >
          <Outlet key={currentKey} />
        </BlurFade>
      </main>
    </SidebarProvider>
  )
}
