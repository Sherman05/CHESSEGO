import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import MoveIndicator from './MoveIndicator';

// Silver gradient circle button per DESIGN_GUIDE
const CIRCLE_BTN: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: '1.5px solid #555',
  background: 'linear-gradient(180deg, #e0e4e8 0%, #b0b8c0 100%)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'filter 0.15s',
  padding: 0,
};

const CIRCLE_FROZEN: React.CSSProperties = {
  ...CIRCLE_BTN,
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
      background: 'linear-gradient(180deg, #C0C8D0 0%, #B0B8C0 100%)',
      minHeight: 40,
      flexShrink: 0,
    }}>
      {/* Ok — only in extended view, per layout: leftmost in bottom row */}
      {isExtended && (
        <button style={CIRCLE_BTN} onClick={onOkClick} title="Готово">
          <span style={{ fontSize: 12, fontWeight: 'bold', color: '#0028fa', fontFamily: 'serif' }}>Ok</span>
        </button>
      )}

      {/* Меню — 3 horizontal lines */}
      <button
        style={CIRCLE_BTN}
        onClick={onMenuClick}
        title="Меню"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <line x1="3" y1="4" x2="13" y2="4" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="8" x2="13" y2="8" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="12" x2="13" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Move Indicator — per design: right of Menu in basic view */}
      {viewMode === 'basic' && <MoveIndicator />}

      {/* Extended: Сброс */}
      {isExtended && (
        <button style={CIRCLE_BTN} onClick={onResetClick} title="Сброс">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M3 7a4 4 0 1 1 1 2.6" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 4v3h3" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Предыдущий ход — double arrow « */}
      <button
        style={prevFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={prevFrozen}
        onClick={prevMove}
        title="Предыдущий ход"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M8 3L4 7l4 4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 3L8 7l4 4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Следующий ход — double arrow » */}
      <button
        style={nextFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={nextFrozen}
        onClick={nextMove}
        title="Следующий ход"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M2 3l4 4-4 4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3l4 4-4 4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Удалить фигуру — circle with X, blue tint */}
      <button
        style={deleteFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
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

      {/* Реверс — circular arrows */}
      <button
        style={reverseFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={reverseFrozen}
        onClick={toggleReverse}
        title="Перевернуть доску"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M3 5l4-2.5L11 5" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 9l-4 2.5L3 9" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default BottomBar;
