import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import MoveIndicator from './MoveIndicator';

const BUTTON_STYLE: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: '50%',
  border: '2px solid #1f1203',
  backgroundColor: 'rgba(179, 179, 179, 0.25)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s',
  padding: 0,
};

const FROZEN_STYLE: React.CSSProperties = {
  ...BUTTON_STYLE,
  opacity: 0.4,
  cursor: 'default',
};

interface BottomBarProps {
  onMenuClick: () => void;
  onResetClick?: () => void;
  onOkClick?: () => void;
  onFirstMoveToggle?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ onMenuClick, onResetClick, onOkClick, onFirstMoveToggle }) => {
  const { gameMode, gameStage, currentTurn, historyIndex, history } = useGameStore();
  const prevMove = useGameStore((s) => s.prevMove);
  const nextMove = useGameStore((s) => s.nextMove);
  const toggleReverse = useGameStore((s) => s.toggleReverse);
  const deleteSelectedPiece = useGameStore((s) => s.deleteSelectedPiece);
  const selectedForDeletion = useGameStore((s) => s.selectedForDeletion);

  const viewMode = getViewMode({ gameMode, gameStage });
  const isStart = viewMode === 'start';
  const isSetup = gameStage === 'setup';
  const isExtended = viewMode === 'extended';

  const prevFrozen = isStart || isSetup || historyIndex <= 0;
  const nextFrozen = isStart || isSetup || historyIndex >= history.length - 1;
  const reverseFrozen = isStart;
  const deleteFrozen = isStart || !selectedForDeletion;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      backgroundColor: '#4a9ae0',
      borderRadius: '0 0 4px 4px',
      minHeight: 46,
    }}>
      {/* Menu */}
      <button
        style={BUTTON_STYLE}
        onClick={onMenuClick}
        title="Меню"
      >
        <svg width="20" height="20" viewBox="0 0 20 20">
          <line x1="4" y1="6" x2="16" y2="6" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="10" x2="16" y2="10" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="14" x2="16" y2="14" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Move Indicator */}
      {viewMode === 'basic' && <MoveIndicator />}

      {/* Extended view buttons */}
      {isExtended && (
        <>
          {/* Reset */}
          <button
            style={BUTTON_STYLE}
            onClick={onResetClick}
            title="Сброс"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M3 9a6 6 0 1 1 1.5 3.9" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 5v4h4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Ok */}
          <button
            style={{ ...BUTTON_STYLE }}
            onClick={onOkClick}
            title="Готово"
          >
            <span style={{ fontSize: 14, fontWeight: 'bold', color: '#0028fa' }}>Ok</span>
          </button>

          {/* 1st move toggle */}
          <button
            style={{
              ...BUTTON_STYLE,
              width: 'auto',
              borderRadius: 8,
              padding: '2px 8px',
              flexDirection: 'column',
              gap: 2,
            }}
            onClick={onFirstMoveToggle}
            title="1-й ход"
          >
            <span style={{ fontSize: 10, color: '#333' }}>1-й ход</span>
            <div style={{
              width: 20,
              height: 10,
              borderRadius: 2,
              backgroundColor: currentTurn === 'white' ? '#fff' : '#000',
              border: '1px solid #333',
            }} />
          </button>
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Previous move */}
      <button
        style={prevFrozen ? FROZEN_STYLE : BUTTON_STYLE}
        disabled={prevFrozen}
        onClick={prevMove}
        title="Предыдущий ход"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M11 4L6 9l5 5" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next move */}
      <button
        style={nextFrozen ? FROZEN_STYLE : BUTTON_STYLE}
        disabled={nextFrozen}
        onClick={nextMove}
        title="Следующий ход"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M7 4l5 5-5 5" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Delete piece */}
      <button
        style={deleteFrozen ? FROZEN_STYLE : BUTTON_STYLE}
        disabled={deleteFrozen}
        onClick={deleteSelectedPiece}
        title="Удалить фигуру"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M5 6h8l-1 9H6L5 6z" fill="none" stroke="#333" strokeWidth="1.5" />
          <path d="M4 4h10" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" fill="none" stroke="#333" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Reverse */}
      <button
        style={reverseFrozen ? FROZEN_STYLE : BUTTON_STYLE}
        disabled={reverseFrozen}
        onClick={toggleReverse}
        title="Перевернуть доску"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M4 6l5-3 5 3" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 12l-5 3-5-3" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default BottomBar;
