import { Column } from "@/types/column";
import { Task } from "@/types/task";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import TaskItem from "./task-item";
import { ColumnHeader } from "./column-header";
import { useState } from "react";
import { Input } from "../ui/input";

interface ColumnProps {
  column: Column;
  index: number;
  onAddTask: (columnId: string, title: string) => void;
}

export default function ColumnComponent({ column, index, onAddTask }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  let tasks = column.tasks || [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      setTaskTitle("");
      setIsEditing(false);
    }
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    onAddTask(column.id, taskTitle);
    setTaskTitle("");
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={`w-[284px] h-fit shrink-0 bg-slate-100 bg-opacity-95 rounded-md pb-2 
            ${snapshot.isDragging ? 'ring-2 ring-primary ring-offset-2 ring-green-300' : ''}
            hover:ring-2 hover:ring-green-300 hover:ring-offset-2
            active:ring-2 active:ring-green-300 active:ring-offset-2`}
        >
          <div {...provided.dragHandleProps} className="pt-2 px-2">
            <ColumnHeader data={column} />
            <Droppable droppableId={column.id} type="task">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-2"
                >
                  {tasks.map((task, index) => (
                    <TaskItem key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add task
                    </Button>
                  ) : (
                    <div className="p-2">
                      <Input
                        className="mb-2"
                        placeholder="Enter task title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost"
                          onClick={() => {
                            setTaskTitle("");
                            setIsEditing(false);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={handleAddTask}
                          className="bg-secondary text-primary"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      )}
    </Draggable>
  );
}