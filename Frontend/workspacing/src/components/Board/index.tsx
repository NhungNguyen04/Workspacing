import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { fetchBoard, addColumn, addTask, updateBoard, Board as BoardType, Column, Task } from '../../../api/api';

const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardType | null>(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const boardData = await fetchBoard('6719b05fd352cc09c8905bf4'); // Replace '123' with the actual board ID
        setBoard(boardData);
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };
    loadBoard();
  }, []);

  const handleAddColumn = async () => {
    if (!board || !newColumnName.trim()) return;
    try {
      const newColumn = await addColumn(board._id, newColumnName);
      setBoard({
        ...board,
        columns: [...board.columns, newColumn],
      });
      setNewColumnName('');
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  const handleAddTask = async (columnId: string) => {
    if (!board || !newTaskName.trim()) return;
    try {
      const newTask = await addTask(board._id, columnId, newTaskName);
      setBoard({
        ...board,
        columns: board.columns.map(column => 
          column.columnId === columnId 
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column
        ),
      });
      setNewTaskName('');
      setActiveColumn(null);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !board) return;

    const { source, destination, draggableId, type } = result;

    if (type === 'COLUMN') {
      const newColumns = Array.from(board.columns);
      const [reorderedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, reorderedColumn);

      const updatedBoard = { ...board, columns: newColumns };
      setBoard(updatedBoard);
      
      try {
        await updateBoard(board._id, updatedBoard);
      } catch (error) {
        console.error('Error updating column order:', error);
        // Optionally revert the state if the API call fails
      }
    } else {
      const sourceColumn = board.columns.find(col => col.columnId === source.droppableId);
      const destColumn = board.columns.find(col => col.columnId === destination.droppableId);

      if (!sourceColumn || !destColumn) return;

      if (source.droppableId === destination.droppableId) {
        const newTasks = Array.from(sourceColumn.tasks);
        const [reorderedTask] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, reorderedTask);

        const newColumns = board.columns.map(col =>
          col.columnId === sourceColumn.columnId ? { ...col, tasks: newTasks } : col
        );

        const updatedBoard = { ...board, columns: newColumns };
        setBoard(updatedBoard);

        try {
          await updateBoard(board._id, updatedBoard);
        } catch (error) {
          console.error('Error updating task position:', error);
          // Optionally revert the state if the API call fails
        }
      } else {
        const sourceTasks = Array.from(sourceColumn.tasks);
        const destTasks = Array.from(destColumn.tasks);
        const [movedTask] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, movedTask);

        const newColumns = board.columns.map(col => {
          if (col.columnId === sourceColumn.columnId) return { ...col, tasks: sourceTasks };
          if (col.columnId === destColumn.columnId) return { ...col, tasks: destTasks };
          return col;
        });

        const updatedBoard = { ...board, columns: newColumns };
        setBoard(updatedBoard);

        try {
          await updateBoard(board._id, updatedBoard);
        } catch (error) {
          console.error('Error updating task position:', error);
          // Optionally revert the state if the API call fails
        }
      }
    }
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="New column name"
          className="border p-2 mr-2"
        />
        <button onClick={handleAddColumn} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Column
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex space-x-4"
            >
              {board.columns.map((column, index) => (
                <Draggable key={column.columnId} draggableId={column.columnId} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-gray-100 p-4 rounded-lg w-64"
                    >
                      <h2 {...provided.dragHandleProps} className="font-bold mb-2">{column.columnName}</h2>
                      <Droppable droppableId={column.columnId} type="TASK">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[50px]">
                            {column.tasks.map((task, index) => (
                              <Draggable key={task.taskId} draggableId={task.taskId} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-2 mb-2 rounded shadow"
                                  >
                                    {task.taskName}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      {activeColumn === column.columnId ? (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="New task name"
                            className="border p-1 w-full mb-1"
                          />
                          <button
                            onClick={() => handleAddTask(column.columnId)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm w-full"
                          >
                            Add Task
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveColumn(column.columnId)}
                          className="mt-2 bg-gray-300 px-2 py-1 rounded text-sm w-full"
                        >
                          Add a task
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;