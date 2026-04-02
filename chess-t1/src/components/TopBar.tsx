import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import { createInitialPosition } from '../logic/pieces';

/* Small gray circle button — per screenshot: Свернуть, Поверх, Закрыть */
const SMALL_CIRCLE: React.CSSProperties = {
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

const SMALL_CIRCLE_FROZEN: React.CSSProperties = {
  ...SMALL_CIRCLE,
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
      gap: 4,
      padding: '3px 6px',
      backgroundColor: '#B8C0C8',
      minHeight: 38,
      flexShrink: 0,
    }}
    data-tauri-drag-region
    >
      {/* Нач.расстановка — rectangular text button with small chess icon per screenshot */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          height: 28,
          padding: '0 8px',
          borderRadius: 3,
          border: '1px solid #888',
          backgroundColor: initialPosFrozen ? '#a8a8a8' : '#d0d0d0',
          cursor: initialPosFrozen ? 'not-allowed' : 'pointer',
          opacity: initialPosFrozen ? 0.5 : 1,
          fontSize: 10,
          fontFamily: 'Arial, sans-serif',
          color: '#1a1a1a',
        }}
        disabled={initialPosFrozen}
        onClick={() => {
          if (initialPosFrozen) return;
          if (isSetup) { setBoard(createInitialPosition()); } else { setInitialPosition(); }
        }}
        title="Начальная расстановка"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <rect x="0" y="0" width="7" height="7" fill="#fff" stroke="#555" strokeWidth="0.5"/>
          <rect x="7" y="0" width="7" height="7" fill="#555" stroke="#555" strokeWidth="0.5"/>
          <rect x="0" y="7" width="7" height="7" fill="#555" stroke="#555" strokeWidth="0.5"/>
          <rect x="7" y="7" width="7" height="7" fill="#fff" stroke="#555" strokeWidth="0.5"/>
        </svg>
        <span style={{ lineHeight: 1.1 }}>Начальная<br/>расстановка</span>
      </button>

      {/* Партия — dark blue, wide, white text */}
      <button
        style={{
          height: 30,
          borderRadius: 4,
          border: '1px solid #1a3050',
          backgroundColor: '#2B4C7E',
          color: '#fff',
          padding: '0 24px',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          cursor: partyFrozen ? 'not-allowed' : 'pointer',
          opacity: partyFrozen ? 0.4 : 1,
          boxShadow: isPartyActive ? 'inset 0 0 6px rgba(255,255,255,0.3)' : 'none',
        }}
        disabled={partyFrozen}
        onClick={onPartyClick}
        title="Партия"
      >
        Партия
      </button>

      {/* Анализ — blue, wide, white text */}
      <button
        style={{
          height: 30,
          borderRadius: 4,
          border: '1px solid #2a6ab0',
          backgroundColor: '#4A90D9',
          color: '#fff',
          padding: '0 24px',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          cursor: analysisFrozen ? 'not-allowed' : 'pointer',
          opacity: analysisFrozen ? 0.4 : 1,
          boxShadow: isAnalysisActive ? 'inset 0 0 6px rgba(255,255,255,0.3)' : 'none',
        }}
        disabled={analysisFrozen}
        onClick={onAnalysisClick}
        title="Анализ"
      >
        Анализ
      </button>

      <div style={{ flex: 1 }} />

      {/* Свернуть — small gray circle */}
      <button
        style={minimizeFrozen ? SMALL_CIRCLE_FROZEN : SMALL_CIRCLE}
        disabled={minimizeFrozen}
        onClick={onMinimize}
        title="Свернуть"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <line x1="3" y1="8" x2="9" y2="8" stroke="#444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Поверх всех окон — small gray circle */}
      <button
        style={{
          ...SMALL_CIRCLE,
          ...(alwaysOnTop ? { backgroundColor: '#a0c0e0' } : {}),
        }}
        onClick={onAlwaysOnTop}
        title="Поверх всех окон"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <rect x="1" y="1" width="6" height="6" fill="none" stroke="#444" strokeWidth="1.5" />
          <rect x="4" y="4" width="6" height="6" fill="#ddd" stroke="#444" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Закрыть — small gray circle */}
      <button
        style={SMALL_CIRCLE}
        onClick={onClose}
        title="Закрыть"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <line x1="2" y1="2" x2="10" y2="10" stroke="#444" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="2" x2="2" y2="10" stroke="#444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default TopBar;
