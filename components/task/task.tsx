import React, { useState, useEffect } from 'react'
import { Task } from '@/types/task'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Calendar as CalendarIcon, Clock, Repeat, Trash2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns'

interface TaskSiderProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskSider: React.FC<TaskSiderProps> = ({ task, open, onClose, onUpdate, onDelete }) => {
  const [editedTask, setEditedTask] = useState<Task>(task)
  
  // Ensure date is properly parsed
  useEffect(() => {
    if (task.dueDate && typeof task.dueDate === 'string') {
      setEditedTask({
        ...task,
        dueDate: new Date(task.dueDate)
      })
    }
  }, [task])

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onUpdate(editedTask)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {task.teamspaceId && (
            <div className="text-sm text-muted-foreground">
              From your teamspace
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedTask.dueDate ? 
                    format(new Date(editedTask.dueDate), 'PPP') : 
                    'Pick a date'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="start"
              >
                <div className="p-3">
                  <Calendar
                    mode="single"
                    selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setEditedTask(prev => ({
                          ...prev,
                          dueDate: date
                        }));
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={editedTask.reminder}
              onCheckedChange={(checked) => setEditedTask({ ...editedTask, reminder: checked })}
            />
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reminder
            </Label>
          </div>

          {/* Add Status Selector */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={editedTask.status}
              onValueChange={(value) => setEditedTask({ ...editedTask, status: value as Task['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Repeat</Label>
            <Select
              value={editedTask.repeat || "none"}
              onValueChange={(value) => setEditedTask({ ...editedTask, repeat: value === "none" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Never</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button onClick={handleSave}>
              Save Changes
            </Button>
            {!task.teamspaceId && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default TaskSider

