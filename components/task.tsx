import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

interface TaskProps {
  task: {
    id: string
    content: string
  }
  index: number
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 mb-2 rounded shadow-sm"
        >
          {task.content}
        </div>
      )}
    </Draggable>
  )
}

export default Task

