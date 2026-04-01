import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import MoveIndicator from './MoveIndicator';

// Silver gradient circle button — 32px diameter, dark border per DESIGN_GUIDE
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

// Frozen: opacity 0.4, cursor not-allowed per DESIGN_GUIDE
const CIRCLE_FROZEN: React.CSSProperties = {
  ...CIRCLE_BTN,
  opacity: 0.4,
  cursor: 'not-allowed',
};

// Hover handler — brightness(1.15) per DESIGN_GUIDE
const hoverOn = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (!(e.currentTarget as HTMLButtonElement).disabled) {
    e.currentTarget.style.filter = 'brightness(1.15)';
  }
};
const hoverOff = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.filter = '';
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

  // Freeze logic per DESIGN_GUIDE — DO NOT CHANGE
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
      {/* 1. Ok — circle with "Ok" text (ONLY in extended view) */}
      {isExtended && (
        <button
          style={CIRCLE_BTN}
          onClick={onOkClick}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
          title="Готово"
        >
          <span style={{ fontSize: 12, fontWeight: 'bold', color: '#0028fa', fontFamily: 'serif' }}>Ok</span>
        </button>
      )}

      {/* 2. Меню — circle with 3 horizontal lines (☰) */}
      <button
        style={CIRCLE_BTN}
        onClick={onMenuClick}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Меню"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <line x1="3" y1="4" x2="13" y2="4" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="8" x2="13" y2="8" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="12" x2="13" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* 3. Move Indicator — text field, NOT button (only in basic view) */}
      {viewMode === 'basic' && <MoveIndicator />}

      {/* Extended: Сброс button */}
      {isExtended && (
        <button
          style={CIRCLE_BTN}
          onClick={onResetClick}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
          title="Сброс"
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M3 7a4 4 0 1 1 1 2.6" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 4v3h3" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* 4. Flex spacer */}
      <div style={{ flex: 1 }} />

      {/* 5. Предыдущий ход — circle with double arrow left («) */}
      <button
        style={prevFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={prevFrozen}
        onClick={prevMove}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Предыдущий ход"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M8 3L4 7l4 4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 3L8 7l4 4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 6. Следующий ход — circle with double arrow right (») */}
      <button
        style={nextFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={nextFrozen}
        onClick={nextMove}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Следующий ход"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M2 3l4 4-4 4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3l4 4-4 4" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 7. Удалить фигуру — circle with X-in-circle (⊗), blue tint */}
      <button
        style={deleteFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={deleteFrozen}
        onClick={deleteSelectedPiece}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Удалить фигуру"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="#4A90D9" strokeWidth="1.5" />
          <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" stroke="#4A90D9" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="9.5" y1="4.5" x2="4.5" y2="9.5" stroke="#4A90D9" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* 8. Реверс — circle with circular arrows (↻) */}
      <button
        style={reverseFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={reverseFrozen}
        onClick={toggleReverse}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Перевернуть доску"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M10.5 4.5A4 4 0 0 0 3.5 5" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3.5 9.5A4 4 0 0 0 10.5 9" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5.5 3L3.5 5l2 2" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.5 11L10.5 9l-2-2" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default BottomBar;
