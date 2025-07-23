"use client"

import * as React from "react"
import {
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { StaffProfile } from "@/types/staff"

import { NAVIGATION_BY_ROLE } from "@/constants/navigation"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  staffProfile: StaffProfile
  onSignOut: () => void
}

export function AppSidebar({ staffProfile, onSignOut, ...props }: AppSidebarProps) {  
  const navItems = NAVIGATION_BY_ROLE[staffProfile.role]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />KafeKita</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser staffProfile={staffProfile} onSignOut={onSignOut} 
        />
      </SidebarFooter>
    </Sidebar>
  )
}
