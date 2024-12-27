'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import BoardHeader from './board-header'
import { Board } from '@/types/board'
import { Column } from '@/types/column'
import { Task } from '@/types/task'
import ColumnComponent from './column'
import { useBoardStore } from '@/store/BoardStore'


export const BoardInterface: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {activeBoard, setActiveBoard} = useBoardStore()

  const board = activeBoard;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch columns for the board
        const columnsData = board?.columns ? board.columns : [];
        console.log(columnsData)
        setColumns(Array.isArray(columnsData) ? columnsData : [])

        // Fetch tasks
        const tasksRes = await fetch('/api/tasks')
        if (!tasksRes.ok) throw new Error('Failed to fetch tasks')
        const tasksData = await tasksRes.json()
        setTasks(Array.isArray(tasksData) ? tasksData : [])

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [board?.id])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // Handle column reordering
    if (type === "column") {
      const items = Array.from(columns);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedColumns = items.map((item, index) => ({
        ...item,
        position: index,
      }));

      setColumns(updatedColumns);
      await fetch('/api/columns', {
        method: 'PUT',
        body: JSON.stringify(updatedColumns),
      });
    }

    // Handle task reordering
    if (type === "task") {
      const items = Array.from(tasks);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedTasks = items.map((item, index) => ({
        ...item,
        position: index,
        columnId: destination.droppableId,
      }));

      setTasks(updatedTasks);
      await fetch('/api/tasks', {
        method: 'PUT',
        body: JSON.stringify(updatedTasks),
      });
    }
  }

  const handleAddColumn = async () => {
    const newColumn: Partial<Column> = {
      title: "New Column",
      position: columns.length,
      boardId: board?.id,
    };

    const response = await fetch(`/api/columns?boardId=${board?.id}`, {
      method: 'POST',
      body: JSON.stringify(newColumn),
    });

    const createdColumn = await response.json();
    setColumns([...columns, createdColumn]);
  }

  const handleAddTask = async (columnId: string) => {
    const newTask = {
      title: "New Task",
      status: "in-progress",
      reminder: false,
      repeat: "",
      category: "",
      columnId,
      position: tasks.filter(t => t.columnId === columnId).length,
    };

    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(newTask),
    });

    const createdTask = await response.json();
    setTasks([...tasks, createdTask]);
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div>
      <BoardHeader/>
      <div className="ml-10">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="column" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex gap-4"
              >
                {columns?.map((column, index) => (
                  <ColumnComponent
                    key={column.id}
                    column={column}
                    tasks={tasks.filter(task => task.columnId === column.id)}
                    index={index}
                    onAddTask={handleAddTask}
                  />
                ))}
                {provided.placeholder}
                <Button
                  variant="outline"
                  className="flex h-12 w-[272px] items-center justify-center gap-2"
                  onClick={handleAddColumn}
                >
                  <Plus className="h-4 w-4" />
                  Add Column
                </Button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}

