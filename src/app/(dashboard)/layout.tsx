
"use client"

import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useUser, useAuth } from "@/firebase/provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, UserCircle, LogOut } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/")
    }
  }, [user, isUserLoading, router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      })
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "BC"

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-card">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground">Secure Banking</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden md:inline-block">{user.email}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                      <Avatar className="h-8 w-8 border shadow-sm">
                        <AvatarImage src={`https://picsum.photos/seed/${user.uid}/200/200`} />
                        <AvatarFallback className="bg-accent text-accent-foreground text-xs font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">My Account</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center w-full cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer" 
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </div>
  )
}
