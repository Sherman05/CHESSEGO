import React from 'react';
import { useGameStore } from '../stores/gameStore';

const MoveIndicator: React.FC = () => {
  const moveIndicator = useGameStore((s) => s.moveIndicator);

  if (!moveIndicator) return null;

  return (
    <div style={{
      padding: '3px 10px',
      backgroundColor: '#E8E0D0',
      borderRadius: 3,
      fontSize: 13,
      fontFamily: 'monospace',
      fontWeight: 'bold',
      color: '#1a1a1a',
      whiteSpace: 'nowrap',
      border: '1px solid #a0a0a0',
    }}>
      {moveIndicator}
    </div>
  );
};

export default MoveIndicator;
