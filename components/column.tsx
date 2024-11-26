import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import Task from './task'

interface ColumnProps {
  column: {
    id: string
    title: string
    tasks: Array<{ id: string; content: string }>
  }
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-64">
      <h2 className="font-bold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[100px]"
          >
            {column.tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default Column

