import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';
import { createInitialPosition } from '../logic/pieces';

// Matches design: white circle with dark border
const CIRCLE_BTN: React.CSSProperties = {
  width: 36,
  height: 36,
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

// Rectangular mode button base
const MODE_BTN: React.CSSProperties = {
  height: 32,
  borderRadius: 6,
  border: '1px solid rgba(0,0,0,0.3)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 18px',
  fontSize: 13,
  fontWeight: 'bold',
  fontFamily: 'Arial, sans-serif',
  transition: 'all 0.15s',
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
      padding: '5px 8px',
      background: 'linear-gradient(180deg, #7ec0ee 0%, #4a9ae0 50%, #3a8ad0 100%)',
      minHeight: 46,
      flexShrink: 0,
    }}>
      {/* Нач. расстановка — small square chess icon per mockup */}
      <button
        style={{
          ...(initialPosFrozen ? CIRCLE_FROZEN : CIRCLE_BTN),
          borderRadius: 4,
          width: 34,
          height: 34,
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
        <svg width="20" height="20" viewBox="0 0 20 20">
          <rect x="2" y="2" width="8" height="8" fill="#fff" stroke="#333" strokeWidth="0.5"/>
          <rect x="10" y="2" width="8" height="8" fill="#888" stroke="#333" strokeWidth="0.5"/>
          <rect x="2" y="10" width="8" height="8" fill="#888" stroke="#333" strokeWidth="0.5"/>
          <rect x="10" y="10" width="8" height="8" fill="#fff" stroke="#333" strokeWidth="0.5"/>
        </svg>
      </button>

      <div style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.4)' }} />

      {/* Партия — blue button per mockup */}
      <button
        style={{
          ...MODE_BTN,
          backgroundColor: partyFrozen ? '#8ab8d8' : '#0068c8',
          color: '#ffffff',
          opacity: partyFrozen ? 0.5 : 1,
          cursor: partyFrozen ? 'default' : 'pointer',
          boxShadow: isPartyActive ? '0 0 8px rgba(0,40,250,0.5), inset 0 0 4px rgba(255,255,255,0.3)' : 'none',
          border: isPartyActive ? '2px solid #0028fa' : '1px solid rgba(0,0,0,0.3)',
        }}
        disabled={partyFrozen}
        onClick={onPartyClick}
        title="Партия"
      >
        Партия
      </button>

      {/* Анализ — red/distinct button per mockup */}
      <button
        style={{
          ...MODE_BTN,
          backgroundColor: analysisFrozen ? '#d89898' : '#c83030',
          color: '#ffffff',
          opacity: analysisFrozen ? 0.5 : 1,
          cursor: analysisFrozen ? 'default' : 'pointer',
          boxShadow: isAnalysisActive ? '0 0 8px rgba(200,48,48,0.5), inset 0 0 4px rgba(255,255,255,0.3)' : 'none',
          border: isAnalysisActive ? '2px solid #a02020' : '1px solid rgba(0,0,0,0.3)',
        }}
        disabled={analysisFrozen}
        onClick={onAnalysisClick}
        title="Анализ"
      >
        Анализ
      </button>

      <div style={{ flex: 1 }} />

      {/* Свернуть — white circle, blue dash */}
      <button
        style={minimizeFrozen ? CIRCLE_FROZEN : CIRCLE_BTN}
        disabled={minimizeFrozen}
        onClick={onMinimize}
        title="Свернуть"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <line x1="3" y1="12" x2="13" y2="12" stroke="#0028fa" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Поверх всех окон — white circle, blue squares */}
      <button
        style={{
          ...CIRCLE_BTN,
          ...(alwaysOnTop ? { backgroundColor: '#d0e8ff', boxShadow: '0 0 6px rgba(0,40,250,0.4)' } : {}),
        }}
        onClick={onAlwaysOnTop}
        title="Поверх всех окон"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="2" y="2" width="8" height="8" rx="1" fill="none" stroke="#0028fa" strokeWidth="1.5" />
          <rect x="5" y="5" width="8" height="8" rx="1" fill="rgba(0,40,250,0.1)" stroke="#0028fa" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Закрыть — white circle, red X */}
      <button
        style={{ ...CIRCLE_BTN }}
        onClick={onClose}
        title="Закрыть"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <line x1="3" y1="3" x2="13" y2="13" stroke="#cc2020" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="13" y1="3" x2="3" y2="13" stroke="#cc2020" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default TopBar;
