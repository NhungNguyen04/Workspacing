'use client'

import { useState, useEffect } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Users, UserCheck, Calendar, CalendarX, AlertTriangle, Clock, Filter, X, FileText, FileX } from 'lucide-react'
import { Task } from '@/types/task'
import { Column } from '@/types/column'
import { useAuth, useOrganization } from '@clerk/nextjs'
import { isAfter, isBefore, addDays, addWeeks, addMonths, startOfDay, endOfDay } from 'date-fns'

interface FilterDialogProps {
  isOpen: boolean
  onClose: () => void
  tasks: Task[]
  columns: Column[]
  onFilter: (filteredTasks: Task[], filteredColumns: Column[]) => void
  onClearFilters?: () => void
}

interface FilterCriteria {
  searchText: string
  withMembers: boolean | null // null = all, true = with members, false = without members
  assignedToMe: boolean
  withDueDate: boolean | null // null = all, true = with due date, false = without due date
  overdue: boolean
  dueSoon: 'day' | 'week' | 'month' | null
  withContent: boolean | null // null = all, true = with content, false = without content
}

export const FilterDialog = ({ isOpen, onClose, tasks, columns, onFilter, onClearFilters }: FilterDialogProps) => {
  const { userId } = useAuth()
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
    },
  })
  const [filters, setFilters] = useState<FilterCriteria>({
    searchText: '',
    withMembers: null,
    assignedToMe: false,
    withDueDate: null,
    overdue: false,
    dueSoon: null,
    withContent: null
  })

  const [filteredResults, setFilteredResults] = useState<{
    tasks: Task[]
    columns: Column[]
  }>({ tasks, columns })

  const resetFilters = () => {
    setFilters({
      searchText: '',
      withMembers: null,
      assignedToMe: false,
      withDueDate: null,
      overdue: false,
      dueSoon: null,
      withContent: null
    })
  }

  const applyFilters = () => {
    let filteredTasks = [...tasks]
    
    // Text search (task title or column title)
    if (filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase()
      filteredTasks = filteredTasks.filter(task => {
        const column = columns.find(col => col.id === task.columnId)
        return (
          task.title.toLowerCase().includes(searchLower) ||
          column?.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
        )
      })
    }

    // Filter by members
    if (filters.withMembers === true) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignedTo && task.assignedTo.length > 0
      )
    } else if (filters.withMembers === false) {
      filteredTasks = filteredTasks.filter(task => 
        !task.assignedTo || task.assignedTo.length === 0
      )
    }

    // Filter by assigned to current user
    if (filters.assignedToMe && userId && memberships?.data) {
      // Find the current user's membership ID
      const currentUserMembership = memberships.data.find((member: any) => 
        member.publicUserData?.userId === userId
      )
      
      if (currentUserMembership) {
        filteredTasks = filteredTasks.filter(task => 
          task.assignedTo && task.assignedTo.includes(currentUserMembership.id)
        )
      } else {
        // If user's membership is not found, return empty array
        filteredTasks = []
      }
    }

    // Filter by due date presence
    if (filters.withDueDate === true) {
      filteredTasks = filteredTasks.filter(task => task.dueDate)
    } else if (filters.withDueDate === false) {
      filteredTasks = filteredTasks.filter(task => !task.dueDate)
    }

    // Filter overdue tasks
    if (filters.overdue) {
      const now = new Date()
      filteredTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false
        return isBefore(new Date(task.dueDate), startOfDay(now))
      })
    }

    // Filter by due soon
    if (filters.dueSoon) {
      const now = new Date()
      let endDate: Date
      
      switch (filters.dueSoon) {
        case 'day':
          endDate = endOfDay(addDays(now, 1))
          break
        case 'week':
          endDate = endOfDay(addWeeks(now, 1))
          break
        case 'month':
          endDate = endOfDay(addMonths(now, 1))
          break
        default:
          endDate = now
      }

      filteredTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false
        const dueDate = new Date(task.dueDate)
        return isAfter(dueDate, now) && isBefore(dueDate, endDate)
      })
    }

    // Filter by content presence
    if (filters.withContent === true) {
      filteredTasks = filteredTasks.filter(task => 
        task.content && task.content.length > 0
      )
    } else if (filters.withContent === false) {
      filteredTasks = filteredTasks.filter(task => 
        !task.content || task.content.length === 0
      )
    }

    // Filter columns to only include those with filtered tasks
    const filteredTaskColumnIds = new Set(filteredTasks.map(task => task.columnId))
    const filteredColumns = columns.map(column => ({
      ...column,
      tasks: filteredTasks.filter(task => task.columnId === column.id)
    })).filter(column => 
      filteredTaskColumnIds.has(column.id) || column.tasks?.length === 0
    )

    setFilteredResults({ tasks: filteredTasks, columns: filteredColumns })
    return { tasks: filteredTasks, columns: filteredColumns }
  }

  const handleApplyFilters = () => {
    const results = applyFilters()
    onFilter(results.tasks, results.columns)
  }

  const handleClearFilters = () => {
    resetFilters()
    if (onClearFilters) {
      onClearFilters()
    }
  }

  // Real-time filtering: Apply filters immediately when criteria change
  useEffect(() => {
    if (isOpen) {
      const results = applyFilters()
      onFilter(results.tasks, results.columns)
    }
  }, [filters, tasks, columns, isOpen])

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.searchText.trim()) count++
    if (filters.withMembers !== null) count++
    if (filters.assignedToMe) count++
    if (filters.withDueDate !== null) count++
    if (filters.overdue) count++
    if (filters.dueSoon) count++
    if (filters.withContent !== null) count++
    return count
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Tasks
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-6 -mr-6">
          <div className="space-y-6 pt-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks or columns..."
                  value={filters.searchText}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <Separator />

            {/* Member Assignment */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Assignment</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant={filters.withMembers === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      withMembers: prev.withMembers === true ? null : true 
                    }))}
                    className="flex-1"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    With Members
                  </Button>
                  <Button
                    variant={filters.withMembers === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      withMembers: prev.withMembers === false ? null : false 
                    }))}
                    className="flex-1"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Unassigned
                  </Button>
                </div>
                <Button
                  variant={filters.assignedToMe ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, assignedToMe: !prev.assignedToMe }))}
                  className="w-full"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assigned to Me
                </Button>
              </div>
            </div>

            <Separator />

            {/* Due Dates */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Due Dates</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant={filters.withDueDate === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      withDueDate: prev.withDueDate === true ? null : true 
                    }))}
                    className="flex-1"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    With Due Date
                  </Button>
                  <Button
                    variant={filters.withDueDate === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      withDueDate: prev.withDueDate === false ? null : false 
                    }))}
                    className="flex-1"
                  >
                    <CalendarX className="h-4 w-4 mr-2" />
                    No Due Date
                  </Button>
                </div>
                
                <Button
                  variant={filters.overdue ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, overdue: !prev.overdue }))}
                  className="w-full"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Overdue
                </Button>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Due Soon</label>
                  <div className="flex gap-1">
                    <Button
                      variant={filters.dueSoon === 'day' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        dueSoon: prev.dueSoon === 'day' ? null : 'day' 
                      }))}
                      className="flex-1 text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Today
                    </Button>
                    <Button
                      variant={filters.dueSoon === 'week' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        dueSoon: prev.dueSoon === 'week' ? null : 'week' 
                      }))}
                      className="flex-1 text-xs"
                    >
                      Week
                    </Button>
                    <Button
                      variant={filters.dueSoon === 'month' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        dueSoon: prev.dueSoon === 'month' ? null : 'month' 
                      }))}
                      className="flex-1 text-xs"
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Content */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Content</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant={filters.withContent === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      withContent: prev.withContent === true ? null : true 
                    }))}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    With Content
                  </Button>
                  <Button
                    variant={filters.withContent === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      withContent: prev.withContent === false ? null : false 
                    }))}
                    className="flex-1"
                  >
                    <FileX className="h-4 w-4 mr-2" />
                    No Content
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Results Summary */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Results</label>
              <div className="text-sm text-muted-foreground">
                Found {filteredResults.tasks.length} task(s) in {filteredResults.columns.filter(col => col.tasks && col.tasks.length > 0).length} column(s)
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t mt-4">
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            disabled={getActiveFiltersCount() === 0}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
