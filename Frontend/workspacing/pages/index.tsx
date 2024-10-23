// src/pages/index.tsx

import React from 'react';
import KanbanBoard from '../src/components/Board';

const HomePage: React.FC = () => {
  const boardId = '6719869e0c5c124b14ebce55'; // Replace with actual board ID

  return (
    <div>
      <KanbanBoard boardId={boardId} />
    </div>
  );
};

export default HomePage;