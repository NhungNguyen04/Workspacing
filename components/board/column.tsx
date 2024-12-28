import { Column } from "@/types/column";
import { Task } from "@/types/task";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import TaskItem from "./task-item";
import { ColumnHeader } from "./column-header";

interface ColumnProps {
  column: Column;
  index: number;
  onAddTask: (columnId: string) => void;
}

const ColumnComponent = ({ column, index, onAddTask }: ColumnProps) => {

  let tasks = column.tasks as Task[];
  if (tasks === undefined) {tasks = [];}
  
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="w-[272px] shrink-0 bg-neutral-100 bg-opacity-80 shadow-md rounded-md p-4"
        >
          <div {...provided.dragHandleProps}>
            <ColumnHeader data={column} />
          </div>
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
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-2"
                  onClick={() => onAddTask(column.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add task
                </Button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default ColumnComponent;
