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
  const [newColumnTitle, setNewColumnTitle] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const {
    activeBoard,
    columns,
    setColumns,
    addColumn,
    tasks,
    setTasks,
    addTask
  } = useBoardStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!activeBoard?.id) return;
      
      try {
        setIsLoading(true)
        setError(null)

        const tasksData = await fetchTasks(activeBoard.id);
        
        // Group tasks by column and update columns
        const updatedColumns = columns.map(col => ({
          ...col,
          tasks: tasksData.filter(task => task.columnId === col.id)
            .sort((a, b) => (a.position || 0) - (b.position || 0))
        }));
        
        setColumns(updatedColumns);
        setTasks(tasksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeBoard?.id, columns.length])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    // Handle column reordering
    if (type === "column") {
      if (source.index === destination.index) return;

      try {
        const newColumns = Array.from(columns);
        const [movedColumn] = newColumns.splice(source.index, 1);
        newColumns.splice(destination.index, 0, movedColumn);

        const updatedColumns = newColumns.map((col, index) => ({
          ...col,
          position: index
        }));

        // Optimistic update
        setColumns(updatedColumns);

        // API update
        await updateColumns(updatedColumns);
      } catch (error) {
        // Revert on failure
        toast.error("Failed to update column positions");
        const originalColumns = Array.from(columns);
        setColumns(originalColumns);
      }
      return;
    }

    // Handle task reordering
    if (type === "task") {
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destColumn = columns.find(col => col.id === destination.droppableId);
      
      if (!sourceColumn || !destColumn) return;

      const task = sourceColumn.tasks?.find(t => t.id === draggableId);
      if (!task) return;

      // Moving within the same column
      if (source.droppableId === destination.droppableId) {
        const newTasks = Array.from(sourceColumn.tasks || []);
        const [movedTask] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, movedTask);

        const updatedColumns = columns.map(col => {
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              tasks: newTasks.map((task, index) => ({
                ...task,
                position: index,
                columnId: col.id
              }))
            };
          }
          return col;
        });

        setColumns(updatedColumns);
        await updateTasks(newTasks);
        return;
      }

      // Moving to different column
      const sourceTasks = Array.from(sourceColumn.tasks || []);
      const destTasks = Array.from(destColumn.tasks || []);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, { ...movedTask, columnId: destination.droppableId });

      const updatedColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setColumns(updatedColumns);
      await updateTasks([
        ...sourceTasks.map((t, i) => ({ ...t, position: i })),
        ...destTasks.map((t, i) => ({ ...t, position: i }))
      ]);
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle || !activeBoard?.id) {
      toast.error("Column title required")
      return
    }

    // Create optimistic column with empty tasks array
    const optimisticColumn: Column = {
      id: Date.now().toString(),
      title: newColumnTitle,
      position: columns.length,
      boardId: activeBoard.id,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Optimistically update the UI
    const updatedColumns = [...columns, optimisticColumn];
    setColumns(updatedColumns);
    setNewColumnTitle(null);
    setIsEditing(false);

    try {
      // Create the column on the server
      const createdColumn = await createColumn({
        title: newColumnTitle,
        position: columns.length,
        boardId: activeBoard.id
      });

      // Update the column with the real data while preserving order
      const finalColumns = updatedColumns.map((col: Column) => 
        col.id === optimisticColumn.id ? { ...createdColumn, tasks: [] } : col
      );
      setColumns(finalColumns);

    } catch (error) {
      // Revert on error
      setColumns(columns);
      toast.error("Failed to create column");
      console.error(error);
    }
  };

  const handleAddTask = async (columnId: string) => {
    const optimisticTask: Task = {
      id: Date.now().toString(),
      title: "New Task",
      status: "in-progress",
      reminder: false,
      repeat: "",
      category: "",
      columnId,
      position: tasks.filter(t => t.columnId === columnId).length,
      userId: '', // Will be set by the server
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to tasks and update column's tasks
    const updatedTasks = [...tasks, optimisticTask];
    setTasks(updatedTasks);

    // Update columns to include the new task
    const updatedColumns = columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...(col.tasks || []), optimisticTask]
        };
      }
      return col;
    });
    setColumns(updatedColumns);

    try {
      const createdTask = await createTask({
        ...optimisticTask,
        columnId
      });
      
      // Update with real task data
      const finalTasks = tasks.map(task => 
        task.id === optimisticTask.id ? createdTask : task
      );
      setTasks(finalTasks);

      // Update columns with real task data
      const finalColumns = columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks?.map(task =>
              task.id === optimisticTask.id ? createdTask : task
            )
          };
        }
        return col;
      });
      setColumns(finalColumns);
      
    } catch (error) {
      // Rollback on error
      const revertedTasks = tasks.filter(task => task.id !== optimisticTask.id);
      setTasks(revertedTasks);
      
      // Revert columns
      const revertedColumns = columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks?.filter(task => task.id !== optimisticTask.id)
          };
        }
        return col;
      });
      setColumns(revertedColumns);
      
      toast.error("Failed to create task");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    }
    if (e.key === 'Escape') {
      setNewColumnTitle(null);
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div>
      <BoardHeader/>
      <div className="m-10 mt-0">
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
                      type="button"
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
                        onKeyDown={handleKeyDown}
                        type="text"
                      />
                      <div className='float-right mt-2 mb-2 flex flex-row'>
                        <Button 
                          type="button"
                          variant='ghost' 
                          onClick={()=>setIsEditing(false)}
                        >
                          <X/>
                        </Button>
                        <Button
                          type="button"
                          className='bg-secondary text-primary mr-2'
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddColumn();
                          }}
                        >
                          + Add
                        </Button>
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

