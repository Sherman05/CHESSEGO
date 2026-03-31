import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';

const BUTTON_STYLE: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: '2px solid #1f1203',
  backgroundColor: 'rgba(179, 179, 179, 0.25)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s',
  padding: 0,
  position: 'relative',
};

const FROZEN_STYLE: React.CSSProperties = {
  ...BUTTON_STYLE,
  opacity: 0.4,
  cursor: 'default',
};

const ACTIVE_HIGHLIGHT: React.CSSProperties = {
  backgroundColor: 'rgba(0, 104, 200, 0.3)',
  boxShadow: '0 0 6px rgba(0, 40, 250, 0.4)',
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

  const isStart = viewMode === 'start';
  const isPartyActive = gameMode === 'party';
  const isAnalysisActive = gameMode === 'analysis';
  const isSetup = gameStage === 'setup';

  // Frozen states
  const initialPosFrozen = isStart;
  const partyFrozen = isPartyActive || (isAnalysisActive && isSetup);
  const analysisFrozen = isAnalysisActive || (isPartyActive);
  const minimizeFrozen = !!promotionPending;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      backgroundColor: '#4a9ae0',
      borderRadius: '4px 4px 0 0',
      minHeight: 48,
    }}>
      {/* Initial position */}
      <button
        style={initialPosFrozen ? FROZEN_STYLE : BUTTON_STYLE}
        disabled={initialPosFrozen}
        onClick={() => !initialPosFrozen && setInitialPosition()}
        title="Начальная расстановка"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="2" y="14" width="18" height="3" rx="1" fill="#333" />
          <rect x="5" y="6" width="12" height="8" rx="1" fill="#333" />
          <rect x="8" y="2" width="6" height="4" rx="1" fill="#333" />
        </svg>
      </button>

      <div style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' }} />

      {/* Party */}
      <button
        style={{
          ...(partyFrozen ? FROZEN_STYLE : BUTTON_STYLE),
          ...(isPartyActive ? ACTIVE_HIGHLIGHT : {}),
          borderRadius: 8,
          width: 'auto',
          padding: '4px 16px',
        }}
        disabled={partyFrozen}
        onClick={onPartyClick}
        title="Партия"
      >
        <span style={{ fontSize: 13, fontWeight: 'bold', color: '#1a1a1a' }}>Партия</span>
      </button>

      {/* Analysis */}
      <button
        style={{
          ...(analysisFrozen ? FROZEN_STYLE : BUTTON_STYLE),
          ...(isAnalysisActive ? ACTIVE_HIGHLIGHT : {}),
          borderRadius: 8,
          width: 'auto',
          padding: '4px 16px',
        }}
        disabled={analysisFrozen}
        onClick={onAnalysisClick}
        title="Анализ"
      >
        <span style={{ fontSize: 13, fontWeight: 'bold', color: '#1a1a1a' }}>Анализ</span>
      </button>

      <div style={{ flex: 1 }} />

      {/* Minimize */}
      <button
        style={minimizeFrozen ? FROZEN_STYLE : BUTTON_STYLE}
        disabled={minimizeFrozen}
        onClick={onMinimize}
        title="Свернуть"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <line x1="4" y1="13" x2="14" y2="13" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Always on top */}
      <button
        style={{
          ...BUTTON_STYLE,
          ...(alwaysOnTop ? ACTIVE_HIGHLIGHT : {}),
        }}
        onClick={onAlwaysOnTop}
        title="Поверх всех окон"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="3" y="3" width="9" height="9" rx="1" fill="none" stroke="#333" strokeWidth="1.5" />
          <rect x="6" y="6" width="9" height="9" rx="1" fill="rgba(179,179,179,0.5)" stroke="#333" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Close */}
      <button
        style={{ ...BUTTON_STYLE, backgroundColor: 'rgba(220, 50, 50, 0.2)' }}
        onClick={onClose}
        title="Закрыть"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <line x1="4" y1="4" x2="14" y2="14" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="14" y1="4" x2="4" y2="14" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default TopBar;
