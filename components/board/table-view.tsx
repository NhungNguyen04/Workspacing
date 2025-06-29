'use client'

import React, { useState } from 'react'
import { useBoardStore } from '@/store/BoardStore'
import { Task } from '@/types/task'
import { Column } from '@/types/column'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText, Users, ArrowUpDown, ArrowUp, ArrowDown, Group, List } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface TableViewProps {
  className?: string
}

type SortField = 'title' | 'columnTitle' | 'assignedTo' | 'dueDate'
type SortDirection = 'asc' | 'desc'

export const TableView: React.FC<TableViewProps> = ({ className }) => {
  const { columns } = useBoardStore()
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [groupByColumn, setGroupByColumn] = useState(true)

  // Group tasks by columns and sort within each group
  const groupedTasks = React.useMemo(() => {
    const groups: Array<{
      column: Column
      tasks: (Task & { columnTitle: string })[]
    }> = []

    // Sort columns by position first to maintain order
    const sortedColumns = [...columns].sort((a, b) => (a.position || 0) - (b.position || 0))

    sortedColumns.forEach(column => {
      if (column.tasks && column.tasks.length > 0) {
        const tasksWithColumnTitle = column.tasks.map(task => ({
          ...task,
          columnTitle: column.title
        }))

        // Sort tasks within each column
        const sortedTasks = [...tasksWithColumnTitle].sort((a, b) => {
          let aVal: any = a[sortField]
          let bVal: any = b[sortField]

          if (sortField === 'assignedTo') {
            aVal = a.assignedTo?.length || 0
            bVal = b.assignedTo?.length || 0
          } else if (sortField === 'dueDate') {
            aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0
            bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0
          } else if (typeof aVal === 'string' && typeof bVal === 'string') {
            aVal = aVal.toLowerCase()
            bVal = bVal.toLowerCase()
          }

          if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
          if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
          return 0
        })

        groups.push({
          column,
          tasks: sortedTasks
        })
      }
    })

    return groups
  }, [columns, sortField, sortDirection])

  // Get total task count
  const totalTasks = React.useMemo(() => {
    return groupedTasks.reduce((total, group) => total + group.tasks.length, 0)
  }, [groupedTasks])

  // Flatten all tasks for non-grouped view
  const allTasks = React.useMemo(() => {
    const tasks: (Task & { columnTitle: string })[] = []
    columns.forEach(column => {
      if (column.tasks) {
        column.tasks.forEach(task => {
          tasks.push({
            ...task,
            columnTitle: column.title
          })
        })
      }
    })
    return tasks
  }, [columns])

  // Sort all tasks for flat view
  const sortedAllTasks = React.useMemo(() => {
    return [...allTasks].sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === 'assignedTo') {
        aVal = a.assignedTo?.length || 0
        bVal = b.assignedTo?.length || 0
      } else if (sortField === 'dueDate') {
        aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0
        bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [allTasks, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-3 w-3 text-primary" /> : 
      <ArrowDown className="h-3 w-3 text-primary" />
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'No due date'
    try {
      return format(new Date(date), 'MMM dd, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const getAssignedMembersDisplay = (assignedTo: string[]) => {
    if (!assignedTo || assignedTo.length === 0) {
      return <span className="text-gray-400 text-sm">Unassigned</span>
    }
    
    return (
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3 text-gray-500" />
        <span className="text-sm">{assignedTo.length} member(s)</span>
      </div>
    )
  }

  const getContentDisplay = (task: Task) => {
    if (task.content) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <FileText className="h-3 w-3" />
          <span className="text-sm">Has content</span>
        </div>
      )
    }
    return <span className="text-gray-400 text-sm">No content</span>
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Table View ({groupByColumn ? totalTasks : sortedAllTasks.length} tasks)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setGroupByColumn(!groupByColumn)}
          className="flex items-center gap-2"
        >
          {groupByColumn ? (
            <>
              <List className="h-4 w-4" />
              <span>Flat View</span>
            </>
          ) : (
            <>
              <Group className="h-4 w-4" />
              <span>Group by Column</span>
            </>
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('title')}
                  className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Task Title
                  {getSortIcon('title')}
                </Button>
              </th>
              <th className="px-6 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('columnTitle')}
                  className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Column
                  {getSortIcon('columnTitle')}
                </Button>
              </th>
              <th className="px-6 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('assignedTo')}
                  className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Assigned Members
                  {getSortIcon('assignedTo')}
                </Button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('dueDate')}
                  className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Due Date
                  {getSortIcon('dueDate')}
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(groupByColumn ? totalTasks : sortedAllTasks.length) === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : groupByColumn ? (
              groupedTasks.map((group) => (
                <React.Fragment key={group.column.id}>
                  {/* Column Header Row */}
                  <tr className="bg-blue-50 border-t-2 border-blue-200">
                    <td colSpan={5} className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-300">
                          {group.column.title}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          ({group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </td>
                  </tr>
                  {/* Tasks for this column */}
                  {group.tasks.map((task: Task & { columnTitle: string }) => (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 max-w-xs">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {task.columnTitle}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getAssignedMembersDisplay(task.assignedTo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getContentDisplay(task)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              /* Flat view - all tasks in one list */
              sortedAllTasks.map((task: Task & { columnTitle: string }) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 max-w-xs">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="text-xs">
                      {task.columnTitle}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getAssignedMembersDisplay(task.assignedTo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getContentDisplay(task)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
