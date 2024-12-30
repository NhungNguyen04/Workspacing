import { Task } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "../ui/card";
import { MoreHorizontal, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { deleteTask, updateTaskTitle } from ".";
import { useBoardStore } from "@/store/BoardStore";
import { toast } from "react-toastify";
import { useState } from "react";
import { Input } from "../ui/input";

interface TaskItemProps {
  task: Task;
  index: number;
}

const TaskItem = ({ task, index }: TaskItemProps) => {
  const { removeTask, restoreTask, updateTaskTitle: updateTaskInStore } = useBoardStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleDelete = async () => {
    setShowDeleteDialog(false);
    removeTask(task.id);
    
    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
    } catch (error) {
      restoreTask(task);
      toast.error("Failed to delete task");
    }
  };

  const handleTitleUpdate = async () => {
    if (editedTitle.trim() === task.title) {
      setIsEditing(false);
      return;
    }

    const originalTitle = task.title;
    // Optimistically update
    updateTaskInStore(task.id, editedTitle);
    setIsEditing(false);

    try {
      await updateTaskTitle(task.id, editedTitle);
    } catch (error) {
      // Restore on failure
      updateTaskInStore(task.id, originalTitle);
      toast.error("Failed to update task");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(task.title);
    }
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`${snapshot.isDragging ? 'ring-2 ring-primary ring-offset-2 ring-green-300' : ''} 
              ${(isEditing || isPopoverOpen) ? 'ring-2 ring-primary ring-offset-2 ring-green-300' : ''}`}
          >
            <CardContent className="p-2 flex justify-between items-center">
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="text-sm h-6 border-none"
                />
              ) : (
                <p className="text-sm cursor-pointer" onClick={() => setIsEditing(true)}>
                  {task.title}
                </p>
              )}
              <Popover onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-auto w-auto p-1">
                    <MoreHorizontal className="h-4 w-fit" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0" side="bottom" align="end">
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-fit justify-start text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        )}
      </Draggable>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;
