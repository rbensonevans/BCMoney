
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Wallet,
  Coins
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "MyTokens", icon: Coins, href: "/mytokens" },
  { title: "Recipients", icon: Users, href: "/recipients" },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar()

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center text-primary-foreground">
          <Wallet className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl group-data-[collapsible=icon]:hidden">BCMoney</span>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.href}
                tooltip={item.title}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
                onClick={() => {
                  if (isMobile) {
                    setOpenMobile(false)
                  }
                }}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
