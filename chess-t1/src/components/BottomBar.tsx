import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import MoveIndicator from './MoveIndicator';

// White circle button with dark border — matches design
const CIRCLE_BTN: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  border: '2px solid #1a1a1a',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s',
  padding: 0,
};

const CIRCLE_FROZEN: React.CSSProperties = {
  ...CIRCLE_BTN,
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
      padding: '5px 8px',
      background: 'linear-gradient(180deg, #4a9ae0 0%, #3a8ad0 50%, #2a7ac0 100%)',
      minHeight: 44,
      flexShrink: 0,
    }}>
      {/* Menu — circle with 3 blue lines per design SVG */}
      <button
        style={CIRCLE_BTN}
        onClick={onMenuClick}
        title="Меню"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <line x1="4" y1="5" x2="14" y2="5" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="9" x2="14" y2="9" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="13" x2="14" y2="13" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Move Indicator — per design: right of Menu in basic view */}
      {viewMode === 'basic' && <MoveIndicator />}

      {/* Extended view buttons: Сброс, Ok, 1-й ход */}
      {isExtended && (
        <>
          <button
            style={CIRCLE_BTN}
            onClick={onResetClick}
            title="Сброс"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M3 8a5 5 0 1 1 1.2 3.2" fill="none" stroke="#0028fa" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 4.5v3.5h3.5" fill="none" stroke="#0028fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Ok — per design SVG: blue "Ok" text in circle */}
          <button
            style={CIRCLE_BTN}
            onClick={onOkClick}
            title="Готово"
          >
            <span style={{ fontSize: 13, fontWeight: 'bold', color: '#0028fa', fontFamily: "'Modern No. 20', serif" }}>Ok</span>
          </button>

          {/* 1-й ход — per design: rounded rect with label + color rectangles */}
          <button
            style={{
              ...CIRCLE_BTN,
              width: 'auto',
              borderRadius: 12,
              padding: '4px 10px',
              flexDirection: 'column',
              gap: 1,
              height: 'auto',
              minHeight: 34,
            }}
            onClick={onFirstMoveToggle}
            title="1-й ход"
          >
            <span style={{ fontSize: 9, color: '#1a1a1a', fontFamily: 'Arial, sans-serif' }}>1-й ход</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{
                width: 22, height: 8, borderRadius: 1,
                backgroundColor: currentTurn === 'white' ? '#fff' : '#ccc',
                border: '1px solid #333',
                position: 'relative',
              }}>
                {currentTurn === 'white' && <div style={{
                  width: 5, height: 5, borderRadius: '50%', backgroundColor: '#555',
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                }} />}
              </div>
              <div style={{
                width: 22, height: 8, borderRadius: 1,
                backgroundColor: currentTurn === 'black' ? '#000' : '#444',
                border: '1px solid #333',
                position: 'relative',
              }}>
                {currentTurn === 'black' && <div style={{
                  width: 5, height: 5, borderRadius: '50%', backgroundColor: '#aaa',
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                }} />}
              </div>
            </div>
          </button>
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Предыдущий ход — blue arrow in white circle */}
      <button
        style={prevFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={prevFrozen}
        onClick={prevMove}
        title="Предыдущий ход"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M10 3L5 8l5 5" fill="none" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Следующий ход */}
      <button
        style={nextFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={nextFrozen}
        onClick={nextMove}
        title="Следующий ход"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M6 3l5 5-5 5" fill="none" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Удалить фигуру */}
      <button
        style={deleteFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={deleteFrozen}
        onClick={deleteSelectedPiece}
        title="Удалить фигуру"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M4 5.5h8l-.8 7.5H4.8L4 5.5z" fill="none" stroke="#0028fa" strokeWidth="1.5" />
          <path d="M3.5 3.5h9" stroke="#0028fa" strokeWidth="2" strokeLinecap="round" />
          <path d="M6.5 3.5V2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" fill="none" stroke="#0028fa" strokeWidth="1.2" />
        </svg>
      </button>

      {/* Перевернуть доску */}
      <button
        style={reverseFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={reverseFrozen}
        onClick={toggleReverse}
        title="Перевернуть доску"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M4 5l4-2.5L12 5" fill="none" stroke="#0028fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 11l-4 2.5L4 11" fill="none" stroke="#0028fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default BottomBar;
