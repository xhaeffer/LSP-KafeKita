"use client"

import React from "react"
import { useRouter } from 'nextjs-toploader/app';

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavMainProps = {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}

export function NavMain({ items }: NavMainProps) {
  const router = useRouter()

  return (
    <SidebarGroup>
      <SidebarMenu className="flex flex-col gap-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              className="cursor-pointer"
              tooltip={item.title}
              onClick={() => router.push(item.url)}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
