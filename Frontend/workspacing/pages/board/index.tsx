// src/pages/index.tsx

import React from 'react';
import Board from '../../src/components/Board';

const HomePage: React.FC = () => {
  const boardId = '6719b05fd352cc09c8905bf4'; // Replace with actual board ID

  return (
    <div>
      <Board  />
    </div>
  );
};

export default HomePage;