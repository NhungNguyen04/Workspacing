// src/components/KanbanBoard.tsx

import React, { useEffect, useState } from 'react';
import { fetchBoard } from '../../api/api';
import { Board } from '../../interfaces/interfaces';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface KanbanBoardProps {
  boardId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const data = await fetchBoard(boardId);
        setBoard(data);
      } catch (err) {
        setError('Failed to fetch board data');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getBoard();
  }, [boardId]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const column = board?.columns.find(col => col._id === source.droppableId);
      if (column) {
        const items = Array.from(column.items);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        column.items = items;
        setBoard(board ? { ...board, _id: board._id || '' } : null);
      }
    } else {
      const sourceColumn = board?.contents.find(col => col.columnName === source.droppableId);
      const destColumn = board?.contents.find(col => col.columnName === destination.droppableId);
      if (sourceColumn && destColumn) {
        const sourceItems = Array.from(sourceColumn.items);
        const destItems = Array.from(destColumn.items);
        const [movedItem] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, movedItem);
        sourceColumn.items = sourceItems;
        destColumn.items = destItems;
        setBoard(board ? { ...board, _id: board._id || '' } : null);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <h1>{board?.name}</h1>
        <div style={{ display: 'flex' }}>
          {board?.columns.map((column) => (
            <Droppable key={column._id} droppableId={column._id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ margin: '0 8px', border: '1px solid lightgrey', borderRadius: '4px', width: '250px' }}
                >
                  <h2>{column.columnName}</h2>
                  {column.items.map((task, index) => (
                    <Draggable key={task} draggableId={task} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: 'none',
                            padding: '16px',
                            margin: '0 0 8px 0',
                            minHeight: '50px',
                            backgroundColor: '#fff',
                            color: '#333',
                            ...provided.draggableProps.style,
                          }}
                        >
                          {task}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;