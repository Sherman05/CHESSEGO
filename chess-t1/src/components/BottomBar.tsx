import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import MoveIndicator from './MoveIndicator';

/* Small gray circle — per screenshot bottom bar */
const GRAY_CIRCLE: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: '1.5px solid #777',
  backgroundColor: '#c8c8c8',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
};

const GRAY_CIRCLE_FROZEN: React.CSSProperties = {
  ...GRAY_CIRCLE,
  opacity: 0.4,
  cursor: 'not-allowed',
};

interface BottomBarProps {
  onMenuClick: () => void;
  onResetClick?: () => void;
  onOkClick?: () => void;
  onFirstMoveToggle?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ onMenuClick, onResetClick, onOkClick }) => {
  const { gameMode, gameStage, historyIndex, history } = useGameStore();
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
      backgroundColor: '#A0A8B0',
      minHeight: 40,
      flexShrink: 0,
    }}>
      {/* Ok — only in extended view, blue text in circle */}
      {isExtended && (
        <button
          style={{
            ...GRAY_CIRCLE,
            width: 32,
            height: 32,
            backgroundColor: '#d0d0d0',
            border: '2px solid #666',
          }}
          onClick={onOkClick}
          title="Готово"
        >
          <span style={{ fontSize: 13, fontWeight: 'bold', color: '#0040c0', fontFamily: 'serif' }}>Ok</span>
        </button>
      )}

      {/* Меню — oval/elongated gray button with 3 blue lines per screenshot */}
      <button
        style={{
          width: 40,
          height: 30,
          borderRadius: 15,
          border: '1.5px solid #666',
          backgroundColor: '#b8c0c8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
        onClick={onMenuClick}
        title="Меню"
      >
        <svg width="20" height="16" viewBox="0 0 20 16">
          <line x1="4" y1="3" x2="16" y2="3" stroke="#0040c0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="8" x2="16" y2="8" stroke="#0040c0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="13" x2="16" y2="13" stroke="#0040c0" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Move Indicator */}
      {viewMode === 'basic' && <MoveIndicator />}

      {/* Extended: Сброс */}
      {isExtended && (
        <button style={GRAY_CIRCLE} onClick={onResetClick} title="Сброс">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M3 7a4 4 0 1 1 1 2.6" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 4v3h3" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Prev move — small gray circle */}
      <button
        style={prevFrozen ? GRAY_CIRCLE_FROZEN : GRAY_CIRCLE}
        disabled={prevFrozen}
        onClick={prevMove}
        title="Предыдущий ход"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M8 2L3 6l5 4" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next move — small gray circle */}
      <button
        style={nextFrozen ? GRAY_CIRCLE_FROZEN : GRAY_CIRCLE}
        disabled={nextFrozen}
        onClick={nextMove}
        title="Следующий ход"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M4 2l5 4-5 4" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Удалить фигуру — blue circle with X per screenshot */}
      <button
        style={{
          ...GRAY_CIRCLE,
          ...(deleteFrozen ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
        }}
        disabled={deleteFrozen}
        onClick={deleteSelectedPiece}
        title="Удалить фигуру"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="#4A90D9" strokeWidth="1.5" />
          <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" stroke="#4A90D9" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="9.5" y1="4.5" x2="4.5" y2="9.5" stroke="#4A90D9" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Реверс — gray circle with arrows */}
      <button
        style={reverseFrozen ? GRAY_CIRCLE_FROZEN : GRAY_CIRCLE}
        disabled={reverseFrozen}
        onClick={toggleReverse}
        title="Перевернуть доску"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M3 5l4-2.5L11 5" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 9l-4 2.5L3 9" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default BottomBar;
