'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface MenuItemType {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
}

export function NavMain({ items }: { items: MenuItemType[] }) {
  return (
    <SidebarGroup className="mt-6 electron-draggable">
      <SidebarGroupLabel>
        Tools
      </SidebarGroupLabel>
      <SidebarMenu className="electron-draggable-release">
        {items.map(item => (
          <SidebarMenuItem
            key={item.url}
          >
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={item.isActive}
            >
              <Link to={item.url}>
                {item.icon && <item.icon />}
                <span className="whitespace-nowrap">{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
