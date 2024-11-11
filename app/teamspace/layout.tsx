'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  LayoutPanelLeft,
  FileText,
  Calendar,
  Users,
  Settings,
  Search,
  LogOut,
  Menu,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { OrganizationSwitcher } from "@clerk/nextjs"

const teamNav = [
  { icon: LayoutPanelLeft, label: "Boards", href: "/teamspace/boards" },
  { icon: FileText, label: "Contents", href: "/teamspace/contents" },
  { icon: Calendar, label: "Events", href: "/teamspace/events" },
  { icon: Users, label: "Members", href: "/teamspace/members" },
  { icon: Settings, label: "Settings", href: "/teamspace/settings" },
]

export default function TeamspaceLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, sessionId, getToken, signOut } = useAuth()
  const { user } = useUser()
  const { organization } = useOrganization()
  const [openSidebar, setOpenSidebar] = React.useState(true)
  const pathname = usePathname()

  if (!isLoaded || !userId) {
    return <div>Loading...</div>
  }

  const handleOpenSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  return (
    <SidebarProvider>
      <div className="grid w-full h-screen grid-cols-[auto_1fr]">
        {/* Left Sidebar - Teamspace */}
        <Sidebar collapsible="icon" className="border-r bg-white">
          <SidebarHeader className="flex items-center justify-center h-16 border-b px-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={organization?.imageUrl} alt={organization?.name || "Organization"} />
                <AvatarFallback>{organization?.name?.[0] || "O"}</AvatarFallback>
              </Avatar>
              {openSidebar && <span>{organization?.name}</span>}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {teamNav.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href}
                          className={`flex items-center space-x-2 ${
                            pathname === item.href
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col">
          {/* Top Navigation */}
          <header className="flex h-16 items-center justify-between border-b px-4 bg-white">
            <div className="flex items-center gap-4">
              <SidebarTrigger onClick={handleOpenSidebar}>
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SidebarTrigger>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/logo.png" alt="logoimage" />
                <AvatarFallback>WS</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-gray-900">Workspacing</span>
              <OrganizationSwitcher
                hidePersonal
                appearance={{
                  elements: {
                    rootBox: "flex items-center gap-2",
                    organizationSwitcherTrigger: "flex items-center gap-2 rounded-md border p-2",
                  },
                }}
              />
              <Link href="/" passHref>
                <Button size="sm" className="gap-2">
                  Switch to Personal
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="w-[200px] pl-8" placeholder="Search..." />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User avatar"} />
                      <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}