"use client"

import React, { useEffect } from 'react'
import { usePathname } from "next/navigation"
import { useRouter } from 'nextjs-toploader/app';
import { signOut } from 'firebase/auth'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { auth } from "@/lib/firebase-client"

import { useAuth } from "@/hooks/useAuth"

import { StaffProfile } from '@/types/staff'

import { NAVIGATION_BY_ROLE } from "@/constants/navigation"
import { ROUTE_PERMISSIONS, DEFAULT_ROUTES } from "@/constants/routes"

type DashboardLayoutProps = {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, role, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth")
        return
      }

      if (pathname === "/dashboard") {
        if (role && role in DEFAULT_ROUTES) {
          router.push(DEFAULT_ROUTES[role])
        } else {
          router.push("/dashboard/access-denied")
        }
        return
      }
      
      if (role) {
        const hasPermission = ROUTE_PERMISSIONS.some(route => 
          pathname.startsWith(route.path) && route.allowedRoles.includes(role)
        );
        
        if (!hasPermission) {
          router.push("/dashboard/access-denied")
        }
      } else {
        router.push("/dashboard/access-denied")
      }
    }
  }, [user, role, loading, pathname])

  const staffProfile: StaffProfile = {
    id: user?.uid || "",
    displayName: user?.displayName  || "User",
    email: user?.email || "",
    role: role!,
  }

  const title = () => {
    const navItems = NAVIGATION_BY_ROLE[role!] || [];
    const currentItem = navItems
      .filter(item => pathname.startsWith(item.url))
      .sort((a, b) => b.url.length - a.url.length)[0] || navItems[0];

    return currentItem ? currentItem.title : "Dashboard";
  }
  
  return user ? (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar 
        variant="inset"
        staffProfile={staffProfile}
        onSignOut={() => signOut(auth)}
      />
      <SidebarInset>
        <SiteHeader title={title()} />
        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  ) : null
}

export default DashboardLayout
