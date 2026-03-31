import React, { useCallback } from 'react';
import { PieceType, PieceColor } from '../logic/pieces';
import type { Piece } from '../logic/pieces';
import { getPieceSvg, getPieceName } from './Piece';
const ALL_TYPES = [
  PieceType.KING,
  PieceType.KONNET,
  PieceType.PRINCE,
  PieceType.RITTER,
  PieceType.KNEKHT,
  PieceType.VER_KNEKHT,
  PieceType.SCOUT,
];

interface PieceTrayProps {
  color: PieceColor;
  cellSize: number;
  side: 'left' | 'right';
}

const PieceTray: React.FC<PieceTrayProps> = ({ color, cellSize }) => {
  const iconSize = cellSize * 0.8;

  const handleDragStart = useCallback((e: React.DragEvent, piece: Piece) => {
    e.dataTransfer.setData('application/json', JSON.stringify(piece));
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: '8px 4px',
      alignItems: 'center',
    }}>
      {ALL_TYPES.map((type) => {
        const piece: Piece = { type, color };
        return (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, piece)}
            style={{
              width: iconSize + 8,
              height: iconSize + 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              border: '1px solid rgba(0,0,0,0.2)',
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.5)',
            }}
            title={getPieceName(type)}
          >
            <img
              src={getPieceSvg(piece)}
              alt={getPieceName(type)}
              style={{ width: iconSize, height: iconSize }}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PieceTray;
