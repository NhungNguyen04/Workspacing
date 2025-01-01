import { Task } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { TaskModal } from "./task-modal";
import { useBoardStore } from "@/store/BoardStore";

interface TaskItemProps {
  task: Task;
  index: number;
}

const TaskItem = ({ task, index }: TaskItemProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => setShowModal(true)}
            className="cursor-pointer"
          >
            <CardContent className="p-2">
              <p className="text-sm">{task.title}</p>
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
