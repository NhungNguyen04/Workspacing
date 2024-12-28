'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import BoardHeader from './board-header'
import { Board } from '@/types/board'
import { Column } from '@/types/column'
import { Task } from '@/types/task'
import ColumnComponent from './column'
import { useBoardStore } from '@/store/BoardStore'
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { fetchTasks, updateColumns, updateTasks, createColumn, createTask } from '.'

export const BoardInterface: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([])
  const [newColumnTitle, setNewColumnTitle] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {activeBoard, setActiveBoard} = useBoardStore()
  const [isEditing, setIsEditing] = useState(false);

  const board = activeBoard;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const columnsData = board?.columns ? board.columns : [];
        setColumns(columnsData)

        const tasksData = await fetchTasks()
        setTasks(tasksData)

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

    if (type === "column") {
      const items = Array.from(columns);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedColumns = items.map((item, index) => ({
        ...item,
        position: index,
      }));

      setColumns(updatedColumns);
      await updateColumns(updatedColumns);
    }

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
      await updateTasks(updatedTasks);
    }
  }

  const handleAddColumn = async () => {
    if (!newColumnTitle) {
      toast.error("Column title required")
      return;
    }
    const newColumn: Partial<Column> = {
      title: newColumnTitle,
      position: columns.length,
      boardId: board?.id,
    };

    const createdColumn = await createColumn(newColumn);
    setColumns([...columns, createdColumn]);
    setNewColumnTitle(null);
  }

  const handleAddTask = async (columnId: string) => {
    const newTask = {
      title: "New Task",
      status: "in-progress",
      reminder: false,
      repeat: "",
      category: "",
      columnId,
      userId: "null",
      position: tasks.filter(t => t.columnId === columnId).length,
    };

    const createdTask = await createTask(newTask);
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
                    index={index}
                    onAddTask={handleAddTask}
                  />
                ))}
                {provided.placeholder}
                <div className='flex h-fit w-[272px] items-center justify-center gap-2 bg-white rounded-md mr-10'>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      className="w-full h-auto"
                      onClick={() => {setIsEditing(true)}}
                    >
                      <Plus className="h-4 w-4" />
                      Add Column
                    </Button>
                  ) : (
                    <div className='flex-1'>
                      <Input
                        className='w-[96%] ml-[2%] mt-2 h-7 p-4'
                        placeholder='Enter column name'
                        value={newColumnTitle || ''}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        
                      ></Input>
                      <div className='float-right mt-2 mb-2 flex flex-row'>
                        <Button variant='ghost' onClick={()=>setIsEditing(false)}>
                          <X/>
                        </Button>
                        <Button
                          className='bg-secondary text-primary mr-2'
                          onClick={handleAddColumn}
                        >
                          + Add</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}

