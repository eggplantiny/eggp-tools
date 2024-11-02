import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import {
  BriefcaseConveyorBeltIcon,
  Code,
  Eraser,
  PaletteIcon,
} from 'lucide-react'
import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'

// Menu items.
const items = [
  {
    title: 'Color tool',
    url: '/color-tool',
    icon: PaletteIcon,
  },
  {
    title: 'HTML to Markdown',
    url: '/html-to-markdown',
    icon: Code,
  },
  {
    title: 'Tailwindcss to CSS',
    url: '/tailwindcss-to-css',
    icon: BriefcaseConveyorBeltIcon,
  },
  {
    title: 'Comment remover',
    url: '/comment-remover',
    icon: Eraser,
  },
]

export function AppSidebar() {
  const location = useLocation()

  const isActivated = useCallback((url: string) => {
    return location.pathname === url
  }, [location.pathname])

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                items.map(item => (
                  <SidebarMenuItem
                    key={item.url}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActivated(item.url)}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
