'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Task {
  id: string
  content: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface BoardComponentProps {
  boardId: string
  boardTitle: string
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', tasks: [{ id: 'task-1', content: 'Sample task' }] },
  { id: 'inprogress', title: 'In Progress', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
]

export function Board({ boardId, boardTitle }: BoardComponentProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [newTask, setNewTask] = useState('')

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // If there's no destination, we don't need to do anything
    if (!destination) return

    // If the source and destination are the same, we don't need to do anything
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Find the source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Create new arrays for the tasks
    const sourceTasks = Array.from(sourceColumn.tasks)
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : Array.from(destColumn.tasks)

    // Remove the task from the source
    const [removed] = sourceTasks.splice(source.index, 1)

    // Insert the task into the destination
    destTasks.splice(destination.index, 0, removed)

    // Create a new columns array with the updated tasks
    const newColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks }
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destTasks }
      }
      return col
    })

    setColumns(newColumns)
  }

  const addTask = (columnId: string) => {
    if (newTask.trim() === '') return

    const newTaskItem: Task = {
      id: `task-${Date.now()}`,
      content: newTask,
    }

    const newColumns = columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: [...col.tasks, newTaskItem] }
        : col
    )

    setColumns(newColumns)
    setNewTask('')
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{boardTitle}</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-100 p-4 rounded-lg w-80">
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <CardContent className="p-2">
                              {task.content}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="mt-4">
                <Input
                  type="text"
                  placeholder="Add a task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTask(column.id)
                    }
                  }}
                />
                <Button
                  onClick={() => addTask(column.id)}
                  className="mt-2 w-full"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Task
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

