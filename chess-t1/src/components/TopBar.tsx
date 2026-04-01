import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import { createInitialPosition } from '../logic/pieces';

// Circular button — silver gradient per DESIGN_GUIDE
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
      {/* Нач. расстановка — chess board 2x2 icon */}
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
        title="Начальная расстановка"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="1" y="1" width="8" height="8" fill="#fff" stroke="#333" strokeWidth="0.5"/>
          <rect x="9" y="1" width="8" height="8" fill="#666" stroke="#333" strokeWidth="0.5"/>
          <rect x="1" y="9" width="8" height="8" fill="#666" stroke="#333" strokeWidth="0.5"/>
          <rect x="9" y="9" width="8" height="8" fill="#fff" stroke="#333" strokeWidth="0.5"/>
        </svg>
      </button>

      {/* Партия — dark blue bg #2B4C7E, white text */}
      <button
        style={{
          height: 30,
          borderRadius: 4,
          border: '1px solid #1a3050',
          backgroundColor: partyFrozen ? '#7090b0' : '#2B4C7E',
          color: '#ffffff',
          cursor: partyFrozen ? 'not-allowed' : 'pointer',
          opacity: partyFrozen ? 0.5 : 1,
          padding: '0 16px',
          fontSize: 13,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          boxShadow: isPartyActive ? 'inset 0 0 6px rgba(255,255,255,0.3)' : 'none',
        }}
        disabled={partyFrozen}
        onClick={onPartyClick}
        title="Партия"
      >
        Партия
      </button>

      {/* Анализ — blue bg #4A90D9, white text */}
      <button
        style={{
          height: 30,
          borderRadius: 4,
          border: '1px solid #2a6ab0',
          backgroundColor: analysisFrozen ? '#8ab8d8' : '#4A90D9',
          color: '#ffffff',
          cursor: analysisFrozen ? 'not-allowed' : 'pointer',
          opacity: analysisFrozen ? 0.5 : 1,
          padding: '0 16px',
          fontSize: 13,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          boxShadow: isAnalysisActive ? 'inset 0 0 6px rgba(255,255,255,0.3)' : 'none',
        }}
        disabled={analysisFrozen}
        onClick={onAnalysisClick}
        title="Анализ"
      >
        Анализ
      </button>

      <div style={{ flex: 1 }} />

      {/* Свернуть */}
      <button
        style={minimizeFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={minimizeFrozen}
        onClick={onMinimize}
        title="Свернуть"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="3" y1="10" x2="11" y2="10" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Поверх всех окон */}
      <button
        style={{
          ...CIRCLE_BTN,
          ...(alwaysOnTop ? { background: 'linear-gradient(180deg, #d0e8ff 0%, #a0c8e8 100%)' } : {}),
        }}
        onClick={onAlwaysOnTop}
        title="Поверх всех окон"
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <rect x="1" y="1" width="7" height="7" rx="1" fill="none" stroke="#333" strokeWidth="1.5" />
          <rect x="5" y="5" width="7" height="7" rx="1" fill="#e8e8e8" stroke="#333" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Закрыть */}
      <button
        style={CIRCLE_BTN}
        onClick={onClose}
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
