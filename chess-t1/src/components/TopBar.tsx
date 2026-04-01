import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import { createInitialPosition } from '../logic/pieces';

// Circular button — 32px diameter, silver gradient bg, dark border per DESIGN_GUIDE
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

// Rectangular button base
const RECT_BTN: React.CSSProperties = {
  height: 30,
  borderRadius: 4,
  padding: '0 16px',
  fontSize: 13,
  fontWeight: 'bold',
  fontFamily: 'Arial, sans-serif',
  cursor: 'pointer',
  transition: 'filter 0.15s',
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

interface TopBarProps {
  onPartyClick: () => void;
  onAnalysisClick: () => void;
  onMinimize: () => void;
  onAlwaysOnTop: () => void;
  onClose: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onPartyClick, onAnalysisClick, onMinimize, onAlwaysOnTop, onClose }) => {
  const { gameMode, gameStage, alwaysOnTop } = useGameStore();
  const viewMode = getViewMode({ gameMode, gameStage });
  const promotionPending = useGameStore((s) => s.promotionPending);
  const setInitialPosition = useGameStore((s) => s.setInitialPosition);
  const setBoard = useGameStore((s) => s.setBoard);

  const isStart = viewMode === 'start';
  const isPartyActive = gameMode === 'party';
  const isAnalysisActive = gameMode === 'analysis';
  const isSetup = gameStage === 'setup';

  // Freeze logic per DESIGN_GUIDE — DO NOT CHANGE
  const initialPosFrozen = isStart;
  const partyFrozen = isPartyActive || (isAnalysisActive && isSetup);
  const analysisFrozen = isAnalysisActive;
  const minimizeFrozen = !!promotionPending;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      background: 'linear-gradient(180deg, #C8D0D8 0%, #A8B4C0 100%)',
      minHeight: 40,
      flexShrink: 0,
    }}>
      {/* 1. Нач.расстановка — chess board 2×2 icon (black-white squares) */}
      <button
        style={{
          ...(initialPosFrozen ? CIRCLE_FROZEN : CIRCLE_BTN),
          borderRadius: 4,
          width: 32,
          height: 32,
        }}
        disabled={initialPosFrozen}
        onClick={() => {
          if (initialPosFrozen) return;
          if (isSetup) {
            setBoard(createInitialPosition());
          } else {
            setInitialPosition();
          }
        }}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Начальная расстановка"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="1" y="1" width="8" height="8" fill="#fff" stroke="#333" strokeWidth="0.5"/>
          <rect x="9" y="1" width="8" height="8" fill="#666" stroke="#333" strokeWidth="0.5"/>
          <rect x="1" y="9" width="8" height="8" fill="#666" stroke="#333" strokeWidth="0.5"/>
          <rect x="9" y="9" width="8" height="8" fill="#fff" stroke="#333" strokeWidth="0.5"/>
        </svg>
      </button>

      {/* 2. Партия — rectangular, dark blue bg #2B4C7E, white text */}
      <button
        style={{
          ...RECT_BTN,
          border: '1px solid #1a3050',
          backgroundColor: '#2B4C7E',
          color: '#FFFFFF',
          opacity: partyFrozen ? 0.4 : 1,
          cursor: partyFrozen ? 'not-allowed' : 'pointer',
          boxShadow: isPartyActive ? 'inset 0 0 6px rgba(255,255,255,0.3)' : 'none',
        }}
        disabled={partyFrozen}
        onClick={onPartyClick}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Партия"
      >
        Партия
      </button>

      {/* 3. Анализ — rectangular, blue bg #4A90D9, white text */}
      <button
        style={{
          ...RECT_BTN,
          border: '1px solid #2a6ab0',
          backgroundColor: '#4A90D9',
          color: '#FFFFFF',
          opacity: analysisFrozen ? 0.4 : 1,
          cursor: analysisFrozen ? 'not-allowed' : 'pointer',
          boxShadow: isAnalysisActive ? 'inset 0 0 6px rgba(255,255,255,0.3)' : 'none',
        }}
        disabled={analysisFrozen}
        onClick={onAnalysisClick}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Анализ"
      >
        Анализ
      </button>

      {/* 4. Flex spacer */}
      <div style={{ flex: 1 }} />

      {/* 5. Свернуть — circle, horizontal line (—) */}
      <button
        style={minimizeFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={minimizeFrozen}
        onClick={onMinimize}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Свернуть"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="3" y1="7" x2="11" y2="7" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* 6. Поверх всех окон — circle, chess texture pattern */}
      <button
        style={{
          ...CIRCLE_BTN,
          ...(alwaysOnTop ? { background: 'linear-gradient(180deg, #d0e8ff 0%, #a0c8e8 100%)' } : {}),
        }}
        onClick={onAlwaysOnTop}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Поверх всех окон"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="2" y="2" width="5" height="5" fill="#666" />
          <rect x="7" y="2" width="5" height="5" fill="#ccc" />
          <rect x="2" y="7" width="5" height="5" fill="#ccc" />
          <rect x="7" y="7" width="5" height="5" fill="#666" />
        </svg>
      </button>

      {/* 7. Закрыть — circle, X cross */}
      <button
        style={CIRCLE_BTN}
        onClick={onClose}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        title="Закрыть"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="3" y1="3" x2="11" y2="11" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <line x1="11" y1="3" x2="3" y2="11" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default TopBar;
