"use client"
import Footer from "@/components/Footer"
import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
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
  LayoutDashboard
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
import {startCase} from "lodash";
import { useBoardStore } from "@/store/BoardStore"
import { getBoards } from "@/lib/api/teamspaceboard"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css' 
import { useCurrentIds } from "@/hooks/use-user"
import { useTeamspaceContentStore } from '@/store/TeamspaceContentStore'
import { useContentStore } from '@/store/ContentStore'
import { getTeamspaceContents } from '@/lib/api/content'

function useMetaData(organization: any) {
  React.useEffect(() => {
    document.title = startCase(organization?.name || "Organization");
  }, [organization]);
}

export default function TeamspaceLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, sessionId, getToken, signOut } = useAuth()
  const { user } = useUser()
  const { organization } = useOrganization()
  const { currentOrgId, setCurrentOrgId } = useCurrentIds();
  useMetaData(organization);
  const [openSidebar, setOpenSidebar] = React.useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const {boards, setBoards, isLoading, setLoading, error, setError  } = useBoardStore();
  const displayBoards = boards.slice(0, 5)

  const fetchBoards = async (teamspaceId: string) => {
    try {
        setLoading(true);
        const response = await getBoards(teamspaceId);
        const data = response;
        
        if (error) {
            throw new Error(error);
        }
        
        setBoards(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load boards';
        toast.error(errorMessage);
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  }
  // Fetch teamspace contents when organization changes
  const { 
    contents: teamspaceContents, 
    setContents: setTeamspaceContents, 
    isLoading: teamspaceContentLoading, 
    setLoading: setTeamspaceContentLoading,
    contentsLoaded: teamspaceContentsLoaded,
    setCurrentTeamspaceId,
    currentTeamspaceId
  } = useTeamspaceContentStore();

  const fetchTeamspaceContents = async (teamspaceId: string) => {
    try {
      setTeamspaceContentLoading(true);
      const data = await getTeamspaceContents(teamspaceId);
      setTeamspaceContents(data);
    } catch (error) {
      console.error('Failed to fetch teamspace contents:', error);
      toast.error('Failed to load teamspace contents');
    } finally {
      setTeamspaceContentLoading(false);
    }
  };

  React.useEffect(() => {
    // Redirect only if the user is not already on a valid organization route
    if (organization?.id) {
      setCurrentOrgId(organization.id); // Store current org ID
      setCurrentTeamspaceId(organization.id); // Store in teamspace content store
      
      const currentPath = (pathname ?? '').split('/').slice(0, 3).join('/');
      const organizationPath = `/teamspace/${organization.id}`;

      if (currentPath !== organizationPath) {
        router.push(organizationPath);
      }
      
      // Fetch boards and contents
      fetchBoards(organization.id);
      
      // Only fetch contents if not loaded or if teamspace changed
      if (!teamspaceContentsLoaded || currentTeamspaceId !== organization.id) {
        fetchTeamspaceContents(organization.id);
      }
      
      // Reset personal content store when in teamspace
      useContentStore.getState().setContentsLoaded(false);
    }
  }, [organization, pathname, router, setCurrentOrgId, teamspaceContentsLoaded, currentTeamspaceId]);
  

  if (!isLoaded || !userId) {
    return <div>Loading...</div>
  }

  const handleOpenSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const handleBoardClick = (id: string) => {
    router.push(`/boards/${id}`)
  }

  const switchToPersonal = () => {
    // Reset teamspace content store when switching to personal
    useTeamspaceContentStore.getState().resetStore();
    router.push('/');
  }

  const teamNav = [
    { icon: LayoutPanelLeft, label: "Boards", href: `/teamspace/${organization?.id}` },
    { icon: FileText, label: "Contents", href: `/teamspace/${organization?.id}/contents` },
    { icon: Settings, label: "Settings", href: `/teamspace/${organization?.id}/settings` },
  ]

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
                      {item.label === "Boards" && openSidebar && (
                        <div className="ml-6 space-y-1 pt-1">
                          {displayBoards.map((board) => (
                            <div
                              key={board.id}
                              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent"
                              onClick={() => handleBoardClick(board.id)}
                            >
                              {board.title.length > 25
                                ? `${board.title.substring(0, 25)}...`
                                : board.title}
                            </div>
                          ))}
                          {boards.length > 5 && (
                            <div className="text-sm text-muted-foreground px-2 py-1">
                              ...and {boards.length - 5} more
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
          <header className="flex h-16 items-center justify-between border-b px-2 sm:px-4 bg-white">
            <div className="flex items-center gap-2 sm:gap-4">
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
              <span className="font-semibold text-gray-900 hidden sm:inline">Workspacing</span>
              <div className="hidden sm:flex items-center gap-2">
                <OrganizationSwitcher
                  hidePersonal
                  appearance={{
                    elements: {
                      rootBox: "flex items-center gap-2",
                      organizationSwitcherTrigger: "flex items-center gap-2 rounded-md border p-2",
                    },
                  }}
                />                <Button size="sm" className="gap-2" onClick={switchToPersonal}>
                  Switch to Personal
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="w-[200px] pl-8" placeholder="Search..." />
              </div>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
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
                  <div className="sm:hidden space-y-2 p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="w-full pl-8" placeholder="Search..." />
                    </div>
                    <OrganizationSwitcher
                      hidePersonal
                      appearance={{
                        elements: {
                          rootBox: "flex items-center gap-2",
                          organizationSwitcherTrigger: "flex w-full items-center gap-2 rounded-md border p-2",
                        },
                      }}
                    />                    <Button size="sm" className="w-full justify-start gap-2" onClick={switchToPersonal}>
                      <LayoutDashboard className="h-4 w-4" />
                      Switch to Personal
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Button>
                  </div>
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
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  )
}
