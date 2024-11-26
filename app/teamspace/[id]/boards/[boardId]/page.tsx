'use client'

import React, { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import Column from '@/components/column'
import { v4 as uuidv4 } from 'uuid'

interface Task {
  id: string
  content: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialData: { [key: string]: Column } = {
  'column-1': {
    id: 'column-1',
    title: 'To Do',
    tasks: [
      { id: uuidv4(), content: 'Task 1' },
      { id: uuidv4(), content: 'Task 2' },
      { id: uuidv4(), content: 'Task 3' },
    ],
  },
  'column-2': {
    id: 'column-2',
    title: 'In Progress',
    tasks: [
      { id: uuidv4(), content: 'Task 4' },
      { id: uuidv4(), content: 'Task 5' },
    ],
  },
  'column-3': {
    id: 'column-3',
    title: 'Done',
    tasks: [
      { id: uuidv4(), content: 'Task 6' },
    ],
  },
}

const Board: React.FC = () => {
  const [columns, setColumns] = useState(initialData)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) return

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId]
      const newTasks = Array.from(column.tasks)
      const [reorderedItem] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, reorderedItem)

      const newColumn = {
        ...column,
        tasks: newTasks,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      })
    } else {
      // Moving from one column to another
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = Array.from(destColumn.tasks)
      const [movedItem] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, movedItem)

      const newColumns = {
        ...columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
        [destColumn.id]: {
          ...destColumn,
          tasks: destTasks,
        },
      }

      setColumns(newColumns)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {Object.values(columns).map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </DragDropContext>
  )
}

export default Board

