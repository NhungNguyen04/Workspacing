import { Task } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { TaskModal } from "./task-modal";
import { useBoardStore } from "@/store/BoardStore";
import { Users, FileText } from "lucide-react";

interface TaskItemProps {
  task: Task;
  index: number;
}

const TaskItem = ({ task, index }: TaskItemProps) => {
  const [showModal, setShowModal] = useState(false);

  // Check if task has assignments or content
  const hasAssignments = task.assignedTo && task.assignedTo.length > 0;
  const hasContent = task.content && task.content.length > 0;

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => setShowModal(true)}
            className="cursor-pointer hover:ring-2 hover:ring-green-300 hover:ring-offset-2 
              active:ring-2 active:ring-primary active:ring-offset-2"
          >
            <CardContent className="p-2 relative">
              <p className="text-sm pr-8">{task.title}</p>
              
              {/* Icons container */}
              <div className="absolute top-1 right-1 flex gap-1">
                {hasAssignments && (
                  <div className="bg-blue-100 rounded-full p-1" title={`Assigned to ${task.assignedTo?.length} member(s)`}>
                    <Users className="h-3 w-3 text-blue-600" />
                  </div>
                )}
                {hasContent && (
                  <div className="bg-green-100 rounded-full p-1" title={`${task.content.length} content(s) linked`}>
                    <FileText className="h-3 w-3 text-green-600" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>

      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        task={task}
      />
    </>
  );
};

export default TaskItem;
