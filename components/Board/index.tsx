import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { fetchBoard, addColumn, addTask, updateBoard, Board as BoardType, Column, Task } from '../../../api/api';

const Board: React.FC = () => {
  return (
    <div>
      This is body
    </div>
  );
};

export default Board;