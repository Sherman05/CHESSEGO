import React from 'react';

interface IntroPageProps {
  onEnterMain: () => void;
  onSkip: () => void;
  onSkipForever: () => void;
  onMinimize: () => void;
  onAlwaysOnTop: () => void;
  onClose: () => void;
}

const INTRO_TEXT = `Как пользоваться программой ГИ chess-T1
(вводный текст)

Настоящая программа ГИ chess-T1 (Графический интерфейс) пользователям игры chess-T1 предоставляет возможность с помощью компьютера:

(1) последовательно (пользователям) проводить анализ партий и позиций игры chess-T1.

(2) двум пользователям играть между собой в игру chess-T1.

Предполагается, что пользователи знают и соблюдают при использовании ГИ chess-T1 правила игры.

Основные элементы управления:

Верхний ряд кнопок:
• Начальная расстановка — устанавливает фигуры в начальное положение
• Партия — запускает режим игры
• Анализ — запускает режим анализа позиций
• Свернуть — сворачивает окно
• Поверх всех окон — удерживает окно поверх других
• Закрыть — закрывает программу

Нижний ряд кнопок:
• Меню — открывает список команд
• Предыдущий ход / Следующий ход — навигация по истории
• Удалить фигуру — удаляет выбранную фигуру с доски
• Перевернуть доску — поворот доски на 180°
• Изменить размер — изменение размера окна

Режим "Партия":
Нажмите кнопку "Партия" для начала новой партии. Будет предложено создать папку для сохранения скриншотов позиций. Белые ходят первыми.

Режим "Анализ":
Нажмите кнопку "Анализ" для расстановки произвольной позиции. Используйте кассы фигур слева и справа от доски. После расстановки нажмите "Ок" для начала игры.

Перемещение фигур:
Нажмите и удерживайте левую кнопку мыши на фигуре, перетащите на нужную клетку и отпустите. Фигура автоматически встанет в центр клетки.`;

const IntroPage: React.FC<IntroPageProps> = ({ onEnterMain, onSkip, onSkipForever, onMinimize, onAlwaysOnTop, onClose }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#4a9ae0',
      borderRadius: 4,
      overflow: 'hidden',
    }}>
      {/* Top controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        gap: 8,
      }}>
        {/* Program symbol (decorative) */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <rect x="4" y="4" width="7" height="7" fill="#fff" />
            <rect x="13" y="4" width="7" height="7" fill="#666" />
            <rect x="4" y="13" width="7" height="7" fill="#666" />
            <rect x="13" y="13" width="7" height="7" fill="#fff" />
          </svg>
        </div>

        {/* Main mode button */}
        <button
          onClick={onEnterMain}
          style={{
            padding: '6px 20px',
            backgroundColor: '#0068c8',
            color: '#fff',
            border: '2px solid #0028fa',
            borderRadius: 16,
            fontSize: 14,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Основной режим
        </button>

        <div style={{ flex: 1 }} />

        {/* Window controls */}
        <button onClick={onMinimize} style={windowBtnStyle} title="Свернуть">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <line x1="3" y1="12" x2="13" y2="12" stroke="#fff" strokeWidth="2" />
          </svg>
        </button>
        <button onClick={onAlwaysOnTop} style={windowBtnStyle} title="Поверх всех окон">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="2" y="2" width="8" height="8" rx="1" fill="none" stroke="#fff" strokeWidth="1.5" />
            <rect x="5" y="5" width="8" height="8" rx="1" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </button>
        <button onClick={onClose} style={{ ...windowBtnStyle, backgroundColor: 'rgba(220,50,50,0.5)' }} title="Закрыть">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <line x1="3" y1="3" x2="13" y2="13" stroke="#fff" strokeWidth="2" />
            <line x1="13" y1="3" x2="3" y2="13" stroke="#fff" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Skip buttons */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '0 12px 8px',
      }}>
        <button
          onClick={onSkip}
          style={{
            padding: '4px 12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 4,
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          Пропустить вводный текст
        </button>
        <button
          onClick={onSkipForever}
          style={{
            padding: '4px 12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 4,
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          Пропустить и не показывать больше
        </button>
      </div>

      {/* Text window */}
      <div style={{
        flex: 1,
        margin: '0 12px 12px',
        backgroundColor: '#d4bc8a',
        border: '2px solid #0028fa',
        borderRadius: 4,
        padding: 16,
        overflowY: 'auto',
        fontFamily: 'Arial, sans-serif',
        fontSize: 13,
        lineHeight: 1.6,
        color: '#1a1a1a',
        whiteSpace: 'pre-wrap',
      }}>
        {INTRO_TEXT}
      </div>
    </div>
  );
};

const windowBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.4)',
  backgroundColor: 'rgba(255,255,255,0.15)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
};

export default IntroPage;
