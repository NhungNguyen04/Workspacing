'use client'

import { Protect } from '@clerk/nextjs'
import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Bell,
  LayoutDashboard,
  ListTodo,
  Calendar,
  FileText,
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
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { useAuth, useUser, useOrganizationList } from "@clerk/nextjs"
import Footer from "@/components/Footer"
import { getContents } from '@/components/content'
import { useContentStore } from '@/store/ContentStore'

const personalNav = [
  { icon: ListTodo, label: "Tasks", href: "/" },
  { icon: FileText, label: "Contents", href: "/contents" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, signOut } = useAuth()
  const { user } = useUser()
  const { userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  })

  const [openSidebar, setOpenSidebar] = React.useState(true)
  const [showDialog, setShowDialog] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { contents, setContents, isLoading, setLoading } = useContentStore()

  const displayContents = contents.slice(0, 5)

  // Add useEffect for controlled API calls
  React.useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !userId || contents.length > 0) return;
      
      setLoading(true);
      try {
        const data = await getContents();
        setContents(data);
      } catch (error) {
        console.error('Failed to fetch contents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, userId]);

  if (!isLoaded || !userId || isLoading) {
    return <div>Loading...</div>
  }

  const handleOpenSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const switchToFirstOrganization = () => {
    if (userMemberships.count) {
      const firstOrganizationId = userMemberships.data[0].id
      router.push(`/teamspace/${firstOrganizationId}`)
    } else {
      setShowDialog(true)
    }
  }

  const handleCreateOrganizationRedirect = () => {
    router.push("/select-org")
    setShowDialog(false)
  }

  const handleContentClick = (id: string) => {
    router.push(`/contents/${id}`)
  }

  return (
    <Protect>
    <SidebarProvider>
      <div className="grid w-full h-screen grid-cols-[auto_1fr]">
        {/* Left Sidebar - Personal Workspace */}
        <Sidebar collapsible="icon" className="border-r bg-white">
          <SidebarHeader className="flex items-center justify-center h-16 border-b px-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User avatar"} />
                <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              {openSidebar && <span>{user?.fullName}</span>}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {personalNav.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                      >
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
                      {item.label === "Contents" && openSidebar && (
                        <div className="ml-6 pt-1 space-y-1">
                          {displayContents.map((content) => (
                            <div
                              key={content.id}
                              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent"
                              onClick={() => handleContentClick(content.id)}
                            >
                              {content.title.length > 25
                                ? `${content.title.substring(0, 25)}...`
                                : content.title}
                            </div>
                          ))}
                          {contents.length > 5 && (
                            <div className="text-sm text-muted-foreground px-2 py-1.5">
                              ...and {contents.length - 5} more
                            </div>
                          )}
                        </div>
                      )}
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
              <Button size="sm" className="gap-2" onClick={switchToFirstOrganization}>
                Switch to Teamspace
              </Button>
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
          <main className="flex-1 p-6">
            {children}
          </main>
          <Footer />
        </div>

        {/* Dialog for Creating an Organization */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <div className="text-center">
              <h2 className="text-lg font-semibold">No Teamspace Found</h2>
              <p className="mt-2 text-sm text-gray-600">
                You don't have any teamspaces yet. Would you like to create one?
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <Button onClick={handleCreateOrganizationRedirect}>
                  Create Teamspace
                </Button>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
    </Protect>
  )
}