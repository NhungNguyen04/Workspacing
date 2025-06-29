import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Calendar } from "../ui/calendar";
import { Task } from "@/types/task";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useBoardStore } from "@/store/BoardStore";
import {Activity, Calendar as CalendarIcon, Check, Layout, List, Settings, Trash, User, Plus, Link, Upload, File, ChevronUp, ChevronDown, Pencil } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { updateTaskDetails, deleteTask, fetchTaskLogs } from '@/lib/api/board'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useCurrentIds } from "@/hooks/use-user";
import { TaskContent } from "./task-content";
import { TaskMember } from "./task-member";

interface AuditLog {
  id: string;
  entityId: string;
  entityType: string;
  entityTitle: string;
  action: string;
  createdAt: string;
  userId: string;
  userImage: string;
  userName: string;
}

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
  const [showTaskMembers, setShowTaskMembers] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [showActivityLogs, setShowActivityLogs] = useState(false);

  const { columnName } = getTaskWithColumn(task.id);

  const [isPersonalTask, setIsPersonalTask] = useState(Boolean(task.userId));
  const {currentOrgId} = useCurrentIds();

  const handlePersonalTaskToggle = async () => {
    try {
      const newPersonalState = !isPersonalTask;
      const updates = {
        userId: newPersonalState ? user?.id || null : null,
      };

      // Update in database
      await updateTaskDetails(task.id, updates);

      // Update local state
      updateTask(task.id, updates);
      setIsPersonalTask(newPersonalState);
    } catch (error) {
      console.error('Failed to update personal task status:', error);
    }
  };

  useEffect(() => {
    if (isOpen && task.id) {
      setIsLoadingLogs(true);
      fetchTaskLogs(task.id)
        .then(setLogs)
        .catch(console.error)
        .finally(() => setIsLoadingLogs(false));
    }
  }, [isOpen, task.id]);

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
        <DialogContent className="min-w-[512px] max-w-[600px] max-h-[85vh] overflow-y-auto" closeButton={false}>
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
                              className="outline-none border-b border-transparent hover:border-gray-300 focus:border-gray-300 transition-colors text-md font-bold flex justify-start items-center"
                            >
                              {task.title}
                              <Pencil className="text-gray-500 ml-2 w-5 h-5" />
                            </div>
                          <p className="font-light text-sm">in column <span className="font-normal underline">{columnName || 'Unknown'}</span></p>
                      </div>
                  </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                  <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <List />
                      <p className="text-md font-bold">Description</p>
                  </div>
                  <div className="grid grid-cols-[24px_1fr] gap-3">
                      <div />
                      <Textarea 
                        placeholder="Add a detailed description" 
                        defaultValue={task.description || ""} 
                        onChange={(e) => setDescription(e.target.value)}
                      />
                  </div>
              </div>              {/* Contents Section */}
              <div className="space-y-2">
                  <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <Link />
                      <p className="text-md font-bold">Linked Content</p>
                  </div>
                  <div className="grid grid-cols-[24px_1fr] gap-3">
                      <div /> 
                      <div className="w-full">
                          <TaskContent task={task} />
                      </div>
                  </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-2">
                  <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <Settings />
                      <p className="text-md font-bold">Actions</p>
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
                              <Button variant="outline" className="justify-start flex-1" onClick={() => setShowTaskMembers(!showTaskMembers)}>
                                  <User className="mr-2" /> Assign to members
                              </Button>
                          </div>                          {showTaskMembers && (
                            <div className="mt-2 mb-16 relative" style={{ zIndex: 60 }}>                              
                              <TaskMember 
                                taskId={task.id}
                              />
                            </div>
                          )}
                          <div className="flex space-x-2">
                              <Button 
                                  variant={isPersonalTask ? "secondary" : "outline"} 
                                  className="justify-start flex-1"
                                  onClick={handlePersonalTaskToggle}
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
                                  
              {/* Activity Section */}
              <div className="space-y-2">
                <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                    <Activity />
                    <div className="flex items-center gap-2">
                      <p className="text-md font-bold">Activity</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full border-2 hover:bg-secondary"
                        onClick={() => setShowActivityLogs(!showActivityLogs)}
                      >
                        {showActivityLogs ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                  {showActivityLogs && (
                    <div className="grid grid-cols-[24px_1fr] gap-3">
                      <div />
                      <div className="space-y-4">
                        {isLoadingLogs ? (
                          <p className="text-sm text-muted-foreground">Loading activity...</p>
                        ) : logs.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No activity yet</p>
                        ) : (
                          logs.map((log) => (
                            <div key={log.id} className="flex items-start space-x-3">
                              {log.userImage && (
                                <img
                                  src={log.userImage}
                                  alt={log.userName}
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">{log.userName}</span>{" "}
                                  {log.action.toLowerCase()}d{" "}
                                  <span className="font-medium">"{log.entityTitle}"</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
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
