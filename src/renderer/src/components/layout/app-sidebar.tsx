import type { MenuItemType } from '@/components/nav-main'
import { NavMain } from '@/components/nav-main'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  BriefcaseConveyorBeltIcon,
  Brush,
  Code,
  Eraser,
  ImageIcon,
  PaletteIcon,
  TextIcon,
} from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([
    {
      title: 'Color tool',
      url: '/color-tool',
      icon: Brush,
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
    {
      title: 'SVG to PNG',
      url: '/svg-to-png',
      icon: ImageIcon,
    },
    {
      title: 'Font to SVG',
      url: '/font-to-svg',
      icon: TextIcon,
    },
    {
      title: 'Dominant colors',
      url: '/dominant-colors',
      icon: PaletteIcon,
    },
  ])

  function isActive(url: string) {
    return location.pathname === url
  }

  useEffect(() => {
    setMenuItems((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          isActive: isActive(item.url),
        }
      })
    })
  }, [location])

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarContent>
        <NavMain
          items={menuItems}
        />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  )
}
