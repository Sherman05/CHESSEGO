import React, { useCallback } from 'react';
import { PieceType, PieceColor } from '../logic/pieces';
import type { Piece } from '../logic/pieces';
import { getPieceSvg, getPieceName } from './Piece';
import { useGameStore } from '../stores/gameStore';

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
  const iconSize = cellSize * 0.85;
  const trayPieceSelected = useGameStore((s) => s.trayPieceSelected);
  const setTrayPieceSelected = useGameStore((s) => s.setTrayPieceSelected);

  const handleDragStart = useCallback((e: React.DragEvent, piece: Piece) => {
    const json = JSON.stringify(piece);
    e.dataTransfer.setData('application/json', json);
    e.dataTransfer.setData('text/plain', json);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  // Click to select piece for placement on board
  const handleClick = useCallback((piece: Piece) => {
    // Toggle selection
    if (trayPieceSelected && trayPieceSelected.type === piece.type && trayPieceSelected.color === piece.color) {
      setTrayPieceSelected(null);
    } else {
      setTrayPieceSelected(piece);
    }
  }, [trayPieceSelected, setTrayPieceSelected]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '6px 4px',
      alignItems: 'center',
    }}>
      {ALL_TYPES.map((type) => {
        const piece: Piece = { type, color };
        const isSelected = trayPieceSelected?.type === type && trayPieceSelected?.color === color;
        return (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, piece)}
            onClick={() => handleClick(piece)}
            style={{
              width: iconSize + 4,
              height: iconSize + 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              borderRadius: 4,
              border: isSelected ? '2px solid #4A90D9' : '2px solid transparent',
              backgroundColor: isSelected ? 'rgba(74,144,217,0.15)' : 'transparent',
            }}
            title={`${getPieceName(type)} — нажмите чтобы выбрать, затем кликните на доску`}
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
