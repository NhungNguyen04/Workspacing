'use client'

import { format, addDays } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Repeat, Plus, X, Check, Pause, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useTaskLogic } from './index'

export default function Component() {
  const {
    tasks,
    newTask,
    setNewTask,
    selectedDate,
    setSelectedDate,
    selectedRepeat,
    setSelectedRepeat,
    reminder,
    setReminder,
    currentDate,
    setCurrentDate,
    inProgressTasks,
    completedTasks,
    cancelledTasks,
    addTask,
    updateTaskStatus,
    Task
  } = useTaskLogic()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">{format(currentDate, 'd')}</h1>
          <p className="text-muted-foreground">
            {format(currentDate, 'MMMM yyyy, EEEE')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, -1))}
          >
            <ChevronDown className="h-4 w-4 rotate-90" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
          >
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30">
          <Input
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          
          <div className="flex flex-wrap gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, 'PP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center space-x-2">
              <Switch
                id="reminder"
                checked={reminder}
                onCheckedChange={setReminder}
              />
              <Label htmlFor="reminder" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Reminder
              </Label>
            </div>

            <Select value={selectedRepeat || ''} onValueChange={(value) => setSelectedRepeat(value as "daily" | "weekly" | "monthly" | null)}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  <span>{selectedRepeat || 'Repeat'}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Button size="sm" className="ml-auto gap-2" onClick={addTask}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* In Progress Tasks */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">In Progress</h2>
            {inProgressTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Due {format(task.dueDate, 'PP')}
                  </div>
                  <div className="flex gap-2">
                    {task.reminder && (
                      <Badge variant="secondary" className="text-xs">
                        Reminder
                      </Badge>
                    )}
                    {task.repeat && (
                      <Badge variant="secondary" className="text-xs">
                        Repeat: {task.repeat}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => updateTaskStatus(task.id, 'cancelled')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Tasks */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-green-600">Completed</h2>
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950/20"
              >
                <div className="space-y-1">
                  <div className="font-medium line-through">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Due {format(task.dueDate, 'PP')}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => updateTaskStatus(task.id, 'in-progress')}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Cancelled Tasks */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-red-600">Cancelled</h2>
            {cancelledTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-950/20"
              >
                <div className="space-y-1">
                  <div className="font-medium line-through">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Due {format(task.dueDate, 'PP')}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => updateTaskStatus(task.id, 'in-progress')}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}