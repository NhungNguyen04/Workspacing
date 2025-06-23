'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import BoardHeader from './board-header'
import { Task } from '@/types/task'
import ColumnComponent from './column'
import { useBoardStore } from '@/store/BoardStore'
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { fetchTasks, updateColumns, updateTasks, createColumn, createTask } from '@/lib/api/board'

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
  const [isColumnLoading, setIsColumnLoading] = useState(false);

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
  }, [activeBoard?.id])

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

  const handleAddColumn = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!newColumnTitle?.trim() || !activeBoard?.id || isColumnLoading) {
      return;
    }

    try {
      setIsColumnLoading(true);
      
      const createdColumn = await createColumn({
        title: newColumnTitle.trim(),
        position: columns.length,
        boardId: activeBoard.id
      });

      setColumns([...columns, { ...createdColumn, tasks: [] }]);
      setNewColumnTitle("");
      setIsEditing(false);
      
    } catch (error) {
      toast.error("Failed to create column");
      console.error(error);
    } finally {
      setIsColumnLoading(false);
    }
  };

  const handleAddTask = async (columnId: string, title: string) => {
    if (!title.trim()) return;
    
    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,
      title: title.trim(),
      status: "in-progress",
      reminder: false,
      repeat: "",
      category: "",
      columnId,
      position: tasks.filter(t => t.columnId === columnId).length,
      userId: 'null',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  
    // Optimistic update
    const newTasks = [...tasks, optimisticTask];
    const newColumns = columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...(col.tasks || []), optimisticTask] }
        : col
    );
  
    setTasks(newTasks);
    setColumns(newColumns);
  
    try {
      const createdTask = await createTask({ ...optimisticTask, columnId });
      
      // Update with real data
      const updatedTasks = newTasks.map(task => 
        task.id === optimisticTask.id ? createdTask : task
      );
      const updatedColumns = newColumns.map(col => 
        col.id === columnId 
          ? { 
              ...col, 
              tasks: col.tasks?.map(task => 
                task.id === optimisticTask.id ? createdTask : task
              )
            }
          : col
      );
  
      setTasks(updatedTasks);
      setColumns(updatedColumns);
    } catch (error) {
      // Rollback on error
      setTasks(tasks.filter(t => t.id !== optimisticTask.id));
      setColumns(columns.map(col => 
        col.id === columnId 
          ? { 
              ...col, 
              tasks: col.tasks?.filter(t => t.id !== optimisticTask.id)
            }
          : col
      ));
      toast.error("Failed to create task");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Only prevent default for Enter key
      if (!isColumnLoading) {
        handleAddColumn();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault(); // Only prevent default for Escape key
      setNewColumnTitle("");
      setIsEditing(false);
    }
    // Remove e.stopPropagation() to allow normal typing
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
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="w-full h-auto"
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
                        autoFocus
                      />
                      <div className='float-right mt-2 mb-2 flex flex-row'>
                        <Button 
                          onClick={() => {
                            setNewColumnTitle("");
                            setIsEditing(false);
                          }}
                          variant='ghost'
                        >
                          <X/>
                        </Button>
                        <Button
                          onClick={handleAddColumn}
                          className='bg-secondary text-primary mr-2'
                          disabled={isColumnLoading}
                        >
                          {isColumnLoading ? 'Adding...' : 'Add'}
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

