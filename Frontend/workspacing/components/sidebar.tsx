'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, CheckSquare, FileText, Users, Settings, LogOut, ChevronDown, ChevronRight, Menu } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, useClerk } from "@clerk/nextjs"

const sidebarItems = [
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Contents', href: '/contents', icon: FileText },
  { name: 'Teamspace', href: '/teamspace', icon: Users },
]

const userTeamspaces = [
  { id: 1, name: 'Personal' },
  { id: 2, name: 'Work Project A' },
  { id: 3, name: 'Client X' },
  { id: 4, name: 'Side Project' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTeamspaceOpen, setIsTeamspaceOpen] = useState(false)

  if (!user) {
    return null // Don't render the sidebar if the user is not authenticated
  }

  return (
    <div className={cn("flex h-full flex-col border-r bg-background transition-all", isCollapsed ? "w-20" : "w-64")}>
      {/* Sidebar toggle button */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img src="/logo.png" alt="WorkSpacing Logo" className="h-8 w-8" />
            <span className="text-lg font-bold">WorkSpacing</span>
          </Link>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Teamspaces dropdown */}
        <div className="p-4">
          <button
            onClick={() => setIsTeamspaceOpen(!isTeamspaceOpen)}
            className="flex items-center w-full space-x-2 text-lg font-semibold tracking-tight"
          >
            <Users className="h-5 w-5" />
            {!isCollapsed && (
              <>
                <span>Your Teamspaces</span>
                {isTeamspaceOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </>
            )}
          </button>
          {isTeamspaceOpen && !isCollapsed && (
            <div className="mt-2 space-y-1">
              {userTeamspaces.map((teamspace) => (
                <Button
                  key={teamspace.id}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/dashboard/teamspace/${teamspace.id}`}>
                    <Users className="mr-2 h-4 w-4" />
                    {teamspace.name}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User account dropdown */}
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.imageUrl} alt={user.fullName || user.username || ''} />
                <AvatarFallback>{user.firstName?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isCollapsed && <span className="truncate">{user.fullName || user.username}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
