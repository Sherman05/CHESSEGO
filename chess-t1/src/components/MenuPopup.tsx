import React from 'react';
import { useGameStore, getViewMode } from '../stores/gameStore';

interface MenuPopupProps {
  onClose: () => void;
  onAbout: () => void;
  onSavePosition: () => void;
  onSavePositionAs: () => void;
  onEndParty: () => void;
  onExit: () => void;
}

const MenuPopup: React.FC<MenuPopupProps> = ({ onClose, onAbout, onSavePosition, onSavePositionAs, onEndParty, onExit }) => {
  const { gameMode, gameStage } = useGameStore();
  const viewMode = getViewMode({ gameMode, gameStage });
  const isStart = viewMode === 'start';
  const isSetup = gameStage === 'setup';

  const items = [
    { label: 'О программе', action: onAbout, frozen: false },
    { label: 'Сохранить позицию', action: onSavePosition, frozen: isStart || isSetup },
    { label: 'Сохранить позицию как', action: onSavePositionAs, frozen: isStart || isSetup },
    { label: 'Завершить партию', action: onEndParty, frozen: isStart || isSetup },
    { label: 'Создать ярлык', action: () => {}, frozen: false },
    { label: 'Выход', action: onExit, frozen: false },
  ];

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 149,
        }}
        onClick={onClose}
      />
      <div style={{
        position: 'absolute',
        bottom: 46,
        left: -180,
        width: 200,
        backgroundColor: '#f5f5f5',
        border: '2px solid #0028fa',
        borderRadius: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        zIndex: 150,
        overflow: 'hidden',
      }}>
        {items.map((item, i) => (
          <button
            key={i}
            disabled={item.frozen}
            onClick={() => {
              if (!item.frozen) {
                item.action();
                onClose();
              }
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 14px',
              border: 'none',
              borderBottom: i < items.length - 1 ? '1px solid #ddd' : 'none',
              backgroundColor: 'transparent',
              textAlign: 'left',
              fontSize: 13,
              color: item.frozen ? '#aaa' : '#1a1a1a',
              cursor: item.frozen ? 'default' : 'pointer',
              fontFamily: 'Arial, sans-serif',
            }}
            onMouseEnter={(e) => {
              if (!item.frozen) {
                (e.target as HTMLElement).style.backgroundColor = '#e0e8f0';
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default MenuPopup;
