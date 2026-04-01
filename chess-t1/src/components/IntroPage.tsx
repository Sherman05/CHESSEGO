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

/* Silver gradient circle button style per DESIGN_GUIDE */
const WIN_BTN: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: '1.5px solid #555',
  background: 'linear-gradient(180deg, #e0e4e8 0%, #b0b8c0 100%)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
};

const IntroPage: React.FC<IntroPageProps> = ({
  onEnterMain,
  onSkip,
  onSkipForever,
  onMinimize,
  onAlwaysOnTop,
  onClose,
}) => {
  /* Split INTRO_TEXT: first line is title, rest is body */
  const titleLine = INTRO_TEXT.split('\n')[0];
  const bodyText = INTRO_TEXT.split('\n').slice(1).join('\n');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #4A90D9 0%, #2E6AB0 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── 1. Top bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 8px',
          gap: 8,
          background: 'linear-gradient(180deg, #C8D0D8 0%, #A8B4C0 100%)',
        }}
      >
        {/* Program symbol — decorative 2x2 chess board in a frame */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 3,
            border: '1px solid #888',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect x="1" y="1" width="9" height="9" fill="#fff" stroke="#333" strokeWidth="0.5" />
            <rect x="10" y="1" width="9" height="9" fill="#666" stroke="#333" strokeWidth="0.5" />
            <rect x="1" y="10" width="9" height="9" fill="#666" stroke="#333" strokeWidth="0.5" />
            <rect x="10" y="10" width="9" height="9" fill="#fff" stroke="#333" strokeWidth="0.5" />
          </svg>
        </div>

        {/* "Основной режим" button — blue bg, white text, rounded */}
        <button
          onClick={onEnterMain}
          style={{
            padding: '5px 18px',
            backgroundColor: '#4A90D9',
            color: '#ffffff',
            border: '1px solid #2a6ab0',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            cursor: 'pointer',
          }}
        >
          Основной режим
        </button>

        <div style={{ flex: 1 }} />

        {/* Circle buttons: Свернуть —, Поверх □, Закрыть × */}
        <button onClick={onMinimize} style={WIN_BTN} title="Свернуть">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <line x1="2" y1="9" x2="10" y2="9" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button onClick={onAlwaysOnTop} style={WIN_BTN} title="Поверх">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="none" stroke="#333" strokeWidth="1.5" />
            <rect x="4" y="4" width="6" height="6" rx="1" fill="#e8e8e8" stroke="#333" strokeWidth="1.5" />
          </svg>
        </button>
        <button onClick={onClose} style={WIN_BTN} title="Закрыть">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <line x1="2" y1="2" x2="10" y2="10" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="2" x2="2" y2="10" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── 2. Skip buttons ── */}
      <div style={{ display: 'flex', gap: 6, padding: '6px 8px' }}>
        <button
          onClick={onSkip}
          style={{
            padding: '4px 12px',
            backgroundColor: '#E0D8C0',
            color: '#000000',
            border: '1px solid #808080',
            borderRadius: 3,
            fontSize: 11,
            fontFamily: 'Arial, sans-serif',
            cursor: 'pointer',
          }}
        >
          Пропустить вводный текст / перейти в основной режим
        </button>
        <button
          onClick={onSkipForever}
          style={{
            padding: '4px 12px',
            backgroundColor: '#E0D8C0',
            color: '#000000',
            border: '1px solid #808080',
            borderRadius: 3,
            fontSize: 11,
            fontFamily: 'Arial, sans-serif',
            cursor: 'pointer',
          }}
        >
          Пропустить и не показывать больше
        </button>
      </div>

      {/* ── 3. Text area ── */}
      <div
        style={{
          flex: 1,
          margin: '0 8px 8px',
          backgroundColor: '#D4C8A0',
          border: '2px solid #606060',
          borderRadius: 3,
          padding: 14,
          overflowY: 'auto',
          fontFamily: 'Arial, sans-serif',
          fontSize: 13,
          lineHeight: 1.6,
          color: '#1a1a1a',
        }}
      >
        {/* Title — centered */}
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          {titleLine}
        </div>
        {/* Body — pre-wrapped */}
        <div style={{ whiteSpace: 'pre-wrap' }}>{bodyText}</div>
      </div>

      {/* ── 4. Resize handle — bottom right diagonal dots ── */}
      <div
        style={{
          position: 'absolute',
          right: 2,
          bottom: 2,
          width: 14,
          height: 14,
          cursor: 'nwse-resize',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="11" cy="11" r="1.2" fill="#888" />
          <circle cx="7" cy="11" r="1.2" fill="#888" />
          <circle cx="11" cy="7" r="1.2" fill="#888" />
          <circle cx="3" cy="11" r="1.2" fill="#888" />
          <circle cx="7" cy="7" r="1.2" fill="#888" />
          <circle cx="11" cy="3" r="1.2" fill="#888" />
        </svg>
      </div>
    </div>
  );
};

export default IntroPage;
