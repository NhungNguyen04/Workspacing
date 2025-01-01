import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Calendar } from "../ui/calendar";
import { Task } from "@/types/task";
import { Button } from "../ui/button";
import { useState } from "react";
import { useBoardStore } from "@/store/BoardStore";
import { Activity, Calendar as CalendarIcon, Check, Layout, List, Settings, Trash, User, Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { format } from "date-fns";
import { set } from "lodash";
import { useUser } from "@clerk/nextjs";
import { updateTaskDetails, deleteTask } from "./index";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { user } = useUser();
  const getTaskWithColumn = useBoardStore(state => state.getTaskWithColumn);
  const updateTask = useBoardStore(state => state.updateTask);
  const deleteTaskFromColumn = useBoardStore(state => state.deleteTaskFromColumn);
  const [editedTitle, setEditedTitle] = useState(task?.title || "");
  const [dueDate, setDueDate] = useState<Date | null>(task.dueDate || null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { columnName } = getTaskWithColumn(task.id);

  const [isPersonalTask, setIsPersonalTask] = useState(Boolean(task.userId));

  const handleSave = async () => {
    try {
      const updates = {
        title: editedTitle,
        description: description,
        dueDate: dueDate,
        userId: isPersonalTask ? user?.id || null : null,
      };

      // Update in database
      await updateTaskDetails(task.id, updates);

      // Update local state
      updateTask(task.id, updates);

      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      // Update local state
      if (task.columnId) {
        deleteTaskFromColumn(task.id, task.columnId);
      } else {
        console.error('Task columnId is undefined or null');
      }
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDueDate(date || null);
    setShowCalendar(false);
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-[512px] max-w-[600px] max-h-[85vh] overflow-y-auto">
          <div className="space-y-6">
              {/* Title Section */}
              <div className="space-y-2">
                  <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                      <Layout className="mt-1.5" />
                      <div className="space-y-2">
                          <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => setEditedTitle(e.currentTarget.textContent || "")}
                              onInput={(e) => setEditedTitle(e.currentTarget.textContent || "")}
                              className="outline-none border-b border-transparent hover:border-gray-300 focus:border-gray-300 transition-colors text-lg font-bold"
                          >
                              {task.title}
                          </div>
                          <p className="font-light text-sm">in column <span className="font-normal underline">{columnName || 'Unknown'}</span></p>
                      </div>
                  </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                  <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <List />
                      <p className="text-lg font-bold">Description</p>
                  </div>
                  <div className="grid grid-cols-[24px_1fr] gap-3">
                      <div />
                      <Textarea 
                        placeholder="Add a detailed description" 
                        defaultValue={task.description || ""} 
                        onChange={(e) => setDescription(e.target.value)}
                      />
                  </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-2">
                  <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <Settings />
                      <p className="text-lg font-bold">Actions</p>
                  </div>
                  <div className="grid grid-cols-[24px_1fr] gap-3">
                      <div />
                      <div className="space-y-2">
                          <div className="flex space-x-2">
                              <div className="flex-1">
                                  <Button 
                                      variant="outline" 
                                      className="justify-start w-full" 
                                      onClick={() => setShowCalendar(!showCalendar)}
                                  >
                                      <CalendarIcon className="mr-2" />
                                      {dueDate ? format(dueDate, 'PPP') : "Add due date"}
                                  </Button>
                                  {showCalendar && (
                                      <div className="mt-2">
                                          <Calendar
                                              mode="single"
                                              selected={dueDate || undefined}
                                              onSelect={handleDateSelect}
                                              initialFocus
                                          />
                                      </div>
                                  )}
                              </div>
                              <Button variant="outline" className="justify-start flex-1">
                                  <User className="mr-2" /> Assign to members
                              </Button>
                          </div>
                          <div className="flex space-x-2">
                              <Button 
                                  variant={isPersonalTask ? "secondary" : "outline"} 
                                  className="justify-start flex-1"
                                  onClick={()=>{setIsPersonalTask(!isPersonalTask)}}
                              >
                                  {isPersonalTask ? (
                                      <>
                                          <Check className="mr-2" /> Add to personal tasks
                                      </>
                                  ) : (
                                      <>
                                          <Plus className="mr-2" /> Add to personal tasks
                                      </>
                                  )}
                              </Button>
                              <Button 
                                variant="destructive" 
                                className="justify-start flex-1" 
                                onClick={() => setShowDeleteAlert(true)}
                              >
                                <Trash className="mr-2" /> Delete
                              </Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <DialogFooter>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button className="bg-secondary text-primary" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
