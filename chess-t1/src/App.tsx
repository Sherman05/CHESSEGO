import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore, getViewMode } from './stores/gameStore';
import { PieceColor } from './logic/pieces';
import Board from './components/Board';
import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import PieceTray from './components/PieceTray';
import PromotionDialog from './components/PromotionDialog';
import FolderDialog from './components/FolderDialog';
import CloseDialog from './components/CloseDialog';
import MenuPopup from './components/MenuPopup';
import IntroPage from './components/IntroPage';
import { captureScreenshot, saveScreenshotToFile, createPartyFolder } from './utils/screenshot';
import { saveSession, loadSession, clearSession, setIntroSkipped, isIntroSkipped } from './utils/persistence';

const App: React.FC = () => {
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [folderMode, setFolderMode] = useState<'party' | 'analysis'>('party');
  const [saveMessage, setSaveMessage] = useState('');
  const [showIntroPage, setShowIntroPage] = useState(false);

  const {
    board, currentTurn, moveNumber, gameMode, gameStage, reversed, partyFolder,
    moveIndicator,
    startParty, startAnalysis, startAnalysisPlay, endSession,
    clearBoard, setFirstMoveTurn, toggleAlwaysOnTop,
    restoreSession,
    setIntroSkipped: storeSetIntroSkipped,
  } = useGameStore();

  const viewMode = getViewMode({ gameMode, gameStage });

  // Startup: check for saved session or show intro
  useEffect(() => {
    (async () => {
      const saved = await loadSession();
      if (saved) {
        restoreSession(saved);
        await clearSession();
      } else if (!isIntroSkipped()) {
        setShowIntroPage(true);
      }
    })();
  }, []);

  const handlePartyClick = useCallback(() => {
    if (gameMode === 'analysis' && gameStage === 'play') {
      endSession();
      return;
    }
    setFolderMode('party');
    setShowFolderDialog(true);
  }, [gameMode, gameStage, endSession]);

  const handleAnalysisClick = useCallback(() => {
    if (gameMode === 'party') {
      endSession();
      return;
    }
    startAnalysis();
  }, [gameMode, startAnalysis, endSession]);

  const handleFolderConfirm = useCallback(async (folderName: string) => {
    setShowFolderDialog(false);
    const folderPath = await createPartyFolder(folderName);
    if (folderMode === 'party') {
      startParty(folderPath);
    } else {
      startAnalysisPlay(folderPath);
    }
  }, [folderMode, startParty, startAnalysisPlay]);

  const handleMinimize = useCallback(async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().minimize();
    } catch (e) {
      console.error('minimize failed:', e);
    }
  }, []);

  const handleAlwaysOnTop = useCallback(async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const win = getCurrentWindow();
      // Read current state directly from window, not from store
      const isCurrentlyOnTop = await win.isAlwaysOnTop();
      await win.setAlwaysOnTop(!isCurrentlyOnTop);
      // Only update store after Tauri API succeeds
      if (useGameStore.getState().alwaysOnTop === isCurrentlyOnTop) {
        toggleAlwaysOnTop();
      }
    } catch (e) {
      console.error('setAlwaysOnTop failed:', e);
      // Still toggle store for visual feedback even if API fails
      toggleAlwaysOnTop();
    }
  }, [toggleAlwaysOnTop]);

  const closeWindow = useCallback(async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
    } catch {
      window.close();
    }
  }, []);

  const handleClose = useCallback(() => {
    if (gameMode !== 'none' && gameStage === 'play') {
      setShowCloseDialog(true);
    } else {
      closeWindow();
    }
  }, [gameMode, gameStage, closeWindow]);

  const handleCloseWithEnd = useCallback(async (save: boolean) => {
    if (save) {
      const blob = await captureScreenshot();
      if (blob) await saveScreenshotToFile(blob, `${moveIndicator || 'position'}.png`, partyFolder);
    }
    await clearSession();
    endSession();
    closeWindow();
  }, [moveIndicator, partyFolder, endSession, closeWindow]);

  const handleCloseWithoutEnd = useCallback(async (save: boolean) => {
    if (save) {
      const blob = await captureScreenshot();
      if (blob) await saveScreenshotToFile(blob, `${moveIndicator || 'position'}.png`, partyFolder);
    }
    await saveSession(board, currentTurn, moveNumber, gameMode, gameStage, partyFolder, moveIndicator);
    closeWindow();
  }, [board, currentTurn, moveNumber, gameMode, gameStage, partyFolder, moveIndicator, closeWindow]);

  const handleSavePosition = useCallback(async () => {
    const blob = await captureScreenshot();
    if (blob) {
      await saveScreenshotToFile(blob, `${moveIndicator || 'position'}.png`, partyFolder);
      setSaveMessage('Текущая позиция сохранена');
      setTimeout(() => setSaveMessage(''), 1500);
    }
  }, [moveIndicator, partyFolder]);

  const handleEndParty = useCallback(() => {
    endSession();
  }, [endSession]);

  const handleEnterMain = useCallback(() => setShowIntroPage(false), []);
  const handleSkipIntro = useCallback(() => setShowIntroPage(false), []);
  const handleSkipIntroForever = useCallback(() => {
    setShowIntroPage(false);
    setIntroSkipped(true);
    storeSetIntroSkipped(true);
  }, [storeSetIntroSkipped]);

  const handleReset = useCallback(() => clearBoard(), [clearBoard]);
  const handleOk = useCallback(() => {
    setFolderMode('analysis');
    setShowFolderDialog(true);
  }, []);
  const handleFirstMoveToggle = useCallback(() => {
    setFirstMoveTurn(currentTurn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE);
  }, [currentTurn, setFirstMoveTurn]);

  const cellSize = 60;

  if (showIntroPage) {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <IntroPage
          onEnterMain={handleEnterMain}
          onSkip={handleSkipIntro}
          onSkipForever={handleSkipIntroForever}
          onMinimize={handleMinimize}
          onAlwaysOnTop={handleAlwaysOnTop}
          onClose={closeWindow}
        />
      </div>
    );
  }

  const isExtended = viewMode === 'extended';

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: '#e8e8e8',
    }}>
      {/* Title bar drag region — entire top bar also draggable */}
      <div
        data-tauri-drag-region
        style={{
          height: 6,
          backgroundColor: '#B8C0C8',
          cursor: 'move',
          flexShrink: 0,
        }}
      />

      <TopBar
        onPartyClick={handlePartyClick}
        onAnalysisClick={handleAnalysisClick}
        onMinimize={handleMinimize}
        onAlwaysOnTop={handleAlwaysOnTop}
        onClose={handleClose}
      />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {isExtended && (
          <PieceTray
            color={reversed ? PieceColor.BLACK : PieceColor.WHITE}
            cellSize={cellSize}
            side="left"
          />
        )}

        <div
          data-board-capture
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            position: 'relative',
          }}
        >
          <Board />
          <PromotionDialog cellSize={cellSize} />
        </div>

        {isExtended && (
          <PieceTray
            color={reversed ? PieceColor.WHITE : PieceColor.BLACK}
            cellSize={cellSize}
            side="right"
          />
        )}
      </div>

      {/* Bottom Bar */}
      <BottomBar
        onMenuClick={() => setShowMenu((prev) => !prev)}
        onResetClick={handleReset}
        onOkClick={handleOk}
        onFirstMoveToggle={handleFirstMoveToggle}
      />

      {/* Menu popup — rendered at top level to avoid any clipping */}
      {showMenu && (
        <MenuPopup
          onClose={() => setShowMenu(false)}
          onAbout={() => setShowIntroPage(true)}
          onSavePosition={handleSavePosition}
          onSavePositionAs={handleSavePosition}
          onEndParty={handleEndParty}
          onExit={handleClose}
        />
      )}

      {/* Resize handle */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 16,
          height: 16,
          cursor: 'nwse-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
        title="Изменить размер"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M11 1L1 11M11 5L5 11M11 9L9 11" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {showFolderDialog && (
        <FolderDialog
          onConfirm={handleFolderConfirm}
          onCancel={() => setShowFolderDialog(false)}
        />
      )}

      {showCloseDialog && (
        <CloseDialog
          hasActiveSession={gameMode !== 'none' && gameStage === 'play'}
          onCloseWithEnd={handleCloseWithEnd}
          onCloseWithoutEnd={handleCloseWithoutEnd}
          onCancel={() => setShowCloseDialog(false)}
        />
      )}

      {saveMessage && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 20px',
          backgroundColor: 'rgba(0, 100, 200, 0.9)',
          color: '#fff',
          borderRadius: 6,
          fontSize: 14,
          zIndex: 300,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default App;
