import { Task } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "../ui/card";

interface TaskItemProps {
  task: Task;
  index: number;
}

const TaskItem = ({ task, index }: TaskItemProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <CardContent className="p-2">
            <p className="">{task.title}</p>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskItem;
