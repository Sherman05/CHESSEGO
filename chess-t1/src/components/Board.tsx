import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { FILES, RANKS, Square, toSquare, parseSquare, isCastle, PieceColor, PieceType, boardToSerializable } from '../logic/pieces';
import type { Piece } from '../logic/pieces';
import PieceComponent, { getPieceSvg } from './Piece';
import { checkPromotion } from '../logic/promotion';
import { checkScoutCapture } from '../logic/scout';

// Design colors — matched to screenshot pixel-perfect
const COLORS = {
  lightSquare: '#FFFFFF',
  darkSquare: '#808080',
  castleSquare: '#C0C0C0',
  border: '#4A90D9',               // Blue frame — per screenshot
  borderOuter: '#2E6AB0',          // Outer edge slightly darker
  notationBg: '#4A90D9',           // Blue background for notation area
  notationText: '#FFFFFF',         // White text on blue
  highlightStart: 'rgba(144, 208, 128, 0.5)',
  highlightHover: 'rgba(144, 208, 128, 0.35)',
  highlightLastMove: 'rgba(240, 232, 128, 0.3)',
  highlightSelected: 'rgba(255, 100, 100, 0.35)',
  cellBorder: 'rgba(0, 0, 0, 0.15)',
};

function isLightSquare(file: string, rank: number): boolean {
  const fileIdx = FILES.indexOf(file as typeof FILES[number]);
  // a1 must be dark (black): fileIdx=0 + rank=1 = odd → dark
  return (fileIdx + rank) % 2 === 0;
}

interface DragState {
  piece: Piece;
  fromSquare: Square;
  x: number;
  y: number;
  hoveredSquare: Square | null;
}

const Board: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [containerSize, setContainerSize] = useState(600);

  const {
    board, currentTurn, gameMode, gameStage, reversed, lastMove,
    promotionPending, selectedForDeletion,
    movePiece, removePiece, setSelectedForDeletion,
    setPromotionPending,
  } = useGameStore();

  // viewMode used indirectly via isSetup

  // Responsive sizing — use ResizeObserver for reliable parent tracking
  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current?.parentElement) {
        const parent = boardRef.current.parentElement;
        const maxSize = Math.min(parent.clientWidth - 20, parent.clientHeight - 20);
        setContainerSize(Math.max(300, maxSize));
      }
    };
    updateSize();

    const parent = boardRef.current?.parentElement;
    if (parent && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateSize);
      ro.observe(parent);
      return () => ro.disconnect();
    } else {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  const notationSize = containerSize * 0.035;
  const borderSize = containerSize * 0.015;
  const boardSize = containerSize - (notationSize + borderSize) * 2;
  const cellSize = boardSize / 8;

  const getFiles = useCallback(() => reversed ? [...FILES].reverse() : [...FILES], [reversed]);
  const getRanks = useCallback(() => reversed ? [...RANKS] : [...RANKS].reverse(), [reversed]);

  const getSquareFromPos = useCallback((clientX: number, clientY: number): Square | null => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const offset = notationSize + borderSize;
    const x = clientX - rect.left - offset;
    const y = clientY - rect.top - offset;
    if (x < 0 || y < 0 || x >= boardSize || y >= boardSize) return null;

    const files = getFiles();
    const ranks = getRanks();
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;

    return toSquare(files[col], ranks[row]);
  }, [boardSize, cellSize, notationSize, borderSize, getFiles, getRanks]);

  const canMove = gameMode !== 'none' && gameStage === 'play' && !promotionPending;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || !canMove) return;
    const sq = getSquareFromPos(e.clientX, e.clientY);
    if (!sq) return;

    // If we have a piece selected for deletion, clicking selects a new one
    const piece = board.get(sq);
    if (!piece) return;

    // Can only move own pieces
    if (piece.color !== currentTurn) return;

    setDragState({
      piece,
      fromSquare: sq,
      x: e.clientX,
      y: e.clientY,
      hoveredSquare: sq,
    });
  }, [board, currentTurn, canMove, getSquareFromPos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;
    const sq = getSquareFromPos(e.clientX, e.clientY);
    setDragState((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY, hoveredSquare: sq } : null);
  }, [dragState, getSquareFromPos]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;

    const targetSq = getSquareFromPos(e.clientX, e.clientY);

    if (!targetSq) {
      // Check if we have a last hovered square to snap to
      if (dragState.hoveredSquare && dragState.hoveredSquare !== dragState.fromSquare) {
        const snapSq = dragState.hoveredSquare;
        const snapTarget = board.get(snapSq);
        // Can't snap to own piece, King, or violate Knekht rank restriction
        const snapRank = parseSquare(snapSq).rank;
        const knekhtBlocked = dragState.piece.type === PieceType.KNEKHT && (
          (dragState.piece.color === PieceColor.WHITE && snapRank >= 7) ||
          (dragState.piece.color === PieceColor.BLACK && snapRank <= 2)
        );
        if (!knekhtBlocked &&
            (!snapTarget || snapTarget.color !== dragState.piece.color) &&
            !(snapTarget && snapTarget.type === PieceType.KING)) {
          movePiece(dragState.fromSquare, snapSq);
          setDragState(null);
          return;
        }
      }
      // No valid snap target — piece disappears (dragged off board)
      removePiece(dragState.fromSquare);
      // Advance turn
      const store = useGameStore.getState();
      const nextTurn = store.currentTurn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
      const nextMoveNumber = nextTurn === PieceColor.WHITE ? store.moveNumber + 1 : store.moveNumber;
      const indicator = nextTurn === PieceColor.WHITE
        ? `${nextMoveNumber}. __ хб`
        : `${nextMoveNumber} … __ хч`;
      useGameStore.setState({
        currentTurn: nextTurn,
        moveNumber: nextMoveNumber,
        moveIndicator: indicator,
        lastMove: { from: dragState.fromSquare, to: null },
      });
      setDragState(null);
      return;
    }

    if (targetSq === dragState.fromSquare) {
      // Clicked same square — no move, just deselect drag
      setDragState(null);
      return;
    }

    // Check if target has own piece
    const targetPiece = board.get(targetSq);
    if (targetPiece && targetPiece.color === dragState.piece.color) {
      // Can't place on own piece - snap back
      setDragState(null);
      return;
    }

    // Knekht movement restrictions: cannot skip promotion rank
    // White Knekht cannot go to ranks 7 or 8 (must promote at rank 6 first)
    // Black Knekht cannot go to ranks 2 or 1 (must promote at rank 3 first)
    if (dragState.piece.type === PieceType.KNEKHT) {
      const targetRank = parseSquare(targetSq).rank;
      if (dragState.piece.color === PieceColor.WHITE && targetRank >= 7) {
        setDragState(null);
        return;
      }
      if (dragState.piece.color === PieceColor.BLACK && targetRank <= 2) {
        setDragState(null);
        return;
      }
    }

    // Kings cannot be captured
    if (targetPiece && targetPiece.type === PieceType.KING) {
      setDragState(null);
      return;
    }

    // Check scout special capture
    const scoutResult = checkScoutCapture(dragState.piece, dragState.fromSquare, targetSq, board);
    if (scoutResult) {
      // Both pieces disappear
      const newBoard = new Map(board);
      newBoard.delete(dragState.fromSquare);
      newBoard.delete(targetSq);
      const store = useGameStore.getState();
      const nextTurn = store.currentTurn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
      const nextMoveNumber = nextTurn === PieceColor.WHITE ? store.moveNumber + 1 : store.moveNumber;
      const indicator = nextTurn === PieceColor.WHITE
        ? `${nextMoveNumber}. __ хб`
        : `${nextMoveNumber} … __ хч`;

      // Record in history
      const newHistory = store.history.slice(0, store.historyIndex + 1);
      newHistory.push({
        board: boardToSerializable(newBoard),
        moveNumber: nextMoveNumber,
        currentTurn: nextTurn,
        indicator,
      });

      useGameStore.setState({
        board: newBoard,
        currentTurn: nextTurn,
        moveNumber: nextMoveNumber,
        lastMove: { from: dragState.fromSquare, to: targetSq },
        moveIndicator: indicator,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
      setDragState(null);
      return;
    }

    // Normal move (including capture)
    movePiece(dragState.fromSquare, targetSq);

    // Check promotions
    const movedPiece = dragState.piece;
    const promotion = checkPromotion(movedPiece, targetSq);
    if (promotion) {
      if (promotion.auto) {
        // Auto-promote knekht -> ver_knekht
        const store = useGameStore.getState();
        const newBoard = new Map(store.board);
        newBoard.set(targetSq, { type: PieceType.VER_KNEKHT, color: movedPiece.color });
        useGameStore.setState({ board: newBoard });
      } else {
        setPromotionPending({
          square: targetSq,
          piece: movedPiece,
          options: promotion.options!,
        });
      }
    }

    setDragState(null);
  }, [dragState, board, movePiece, removePiece, getSquareFromPos, setPromotionPending]);

  // Handle click for piece selection (for deletion)
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (dragState) return;
    if (gameStage !== 'setup' && gameStage !== 'play') return;

    const sq = getSquareFromPos(e.clientX, e.clientY);
    if (!sq) {
      setSelectedForDeletion(null);
      return;
    }

    const piece = board.get(sq);
    if (piece) {
      setSelectedForDeletion(sq);
    } else {
      setSelectedForDeletion(null);
    }
  }, [dragState, board, gameStage, getSquareFromPos, setSelectedForDeletion]);

  // Analysis setup - allow placing any piece
  const handleSetupMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || gameStage !== 'setup') return;
    const sq = getSquareFromPos(e.clientX, e.clientY);
    if (!sq) return;

    // If a tray piece is selected, place it on click
    const { trayPieceSelected, placePiece: storePlacePiece } = useGameStore.getState();
    if (trayPieceSelected) {
      storePlacePiece(sq, trayPieceSelected);
      // Don't deselect — allow placing multiple of the same piece
      return;
    }

    const piece = board.get(sq);
    if (!piece) return;

    setDragState({
      piece,
      fromSquare: sq,
      x: e.clientX,
      y: e.clientY,
      hoveredSquare: sq,
    });
  }, [board, gameStage, getSquareFromPos]);

  const handleSetupMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragState || gameStage !== 'setup') return;

    const targetSq = getSquareFromPos(e.clientX, e.clientY);
    if (!targetSq) {
      // Remove piece if dragged off board
      removePiece(dragState.fromSquare);
      setDragState(null);
      return;
    }

    if (targetSq !== dragState.fromSquare) {
      movePiece(dragState.fromSquare, targetSq);
    }

    setDragState(null);
  }, [dragState, gameStage, getSquareFromPos, movePiece, removePiece]);

  const isSetup = gameStage === 'setup';

  // Handle HTML5 drop from PieceTray (analysis setup)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (gameStage !== 'setup') return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, [gameStage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (gameStage !== 'setup') return;
    e.preventDefault();
    e.stopPropagation();

    // Try to get piece data from multiple formats
    let data = e.dataTransfer.getData('application/json');
    if (!data) data = e.dataTransfer.getData('text/plain');
    if (!data) data = e.dataTransfer.getData('text');
    if (!data) return;

    try {
      const piece = JSON.parse(data) as Piece;
      if (!piece.type || !piece.color) return;
      const sq = getSquareFromPos(e.clientX, e.clientY);
      if (sq) {
        const { placePiece } = useGameStore.getState();
        placePiece(sq, piece);
      }
    } catch {
      // Invalid data
    }
  }, [gameStage, getSquareFromPos]);

  // Handle click for piece selection (for deletion) in play mode too
  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    if (dragState) return;
    if (gameMode === 'none') return;

    const sq = getSquareFromPos(e.clientX, e.clientY);
    if (!sq) {
      setSelectedForDeletion(null);
      return;
    }

    const piece = board.get(sq);
    if (piece) {
      setSelectedForDeletion(sq);
    } else {
      setSelectedForDeletion(null);
    }
  }, [dragState, board, gameMode, getSquareFromPos, setSelectedForDeletion]);

  const renderSquare = (file: string, rank: number, colIdx: number, rowIdx: number) => {
    const sq = toSquare(file, rank);
    const piece = board.get(sq);
    const isLight = isLightSquare(file, rank);
    const castle = isCastle(sq);

    let bgColor = isLight ? COLORS.lightSquare : COLORS.darkSquare;
    if (castle) bgColor = COLORS.castleSquare;

    // Castle hatching pattern per DESIGN_GUIDE
    const castleHatch = castle
      ? 'repeating-linear-gradient(45deg, transparent, transparent 3px, #909090 3px, #909090 4px)'
      : 'none';

    let highlight = '';
    if (dragState?.fromSquare === sq) {
      highlight = COLORS.highlightStart;
    } else if (dragState?.hoveredSquare === sq && dragState.fromSquare !== sq) {
      highlight = COLORS.highlightHover;
    } else if (lastMove.to === sq && !dragState) {
      highlight = COLORS.highlightLastMove;
    }
    if (selectedForDeletion === sq) {
      highlight = COLORS.highlightSelected;
    }

    const isDragging = dragState?.fromSquare === sq;

    return (
      <div
        key={sq}
        data-square={sq}
        style={{
          position: 'absolute',
          left: colIdx * cellSize,
          top: rowIdx * cellSize,
          width: cellSize,
          height: cellSize,
          backgroundColor: bgColor,
          backgroundImage: castleHatch,
          border: `0.5px solid ${COLORS.cellBorder}`,
          boxSizing: 'border-box',
        }}
      >
        {highlight && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: highlight,
            pointerEvents: 'none',
          }} />
        )}
        {piece && (
          <PieceComponent
            piece={piece}
            cellSize={cellSize}
            isDragging={isDragging}
          />
        )}
      </div>
    );
  };

  const files = getFiles();
  const ranks = getRanks();

  return (
    <div
      ref={boardRef}
      style={{
        width: containerSize,
        height: containerSize,
        position: 'relative',
        userSelect: 'none',
        flexShrink: 0,
      }}
      onMouseDown={isSetup ? handleSetupMouseDown : handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={isSetup ? handleSetupMouseUp : handleMouseUp}
      onClick={isSetup ? handleClick : handlePlayClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Outer border — pointerEvents none so drops pass through */}
      <div style={{
        position: 'absolute',
        inset: 0,
        border: `${borderSize * 1.5}px solid ${COLORS.borderOuter}`,
        borderRadius: 3,
        pointerEvents: 'none',
        zIndex: 5,
      }} />

      {/* Inner area with notation */}
      <div style={{
        position: 'absolute',
        left: borderSize,
        top: borderSize,
        right: borderSize,
        bottom: borderSize,
        backgroundColor: COLORS.notationBg,
      }}>
        {/* Left notation (ranks) */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: notationSize,
          width: notationSize,
          height: boardSize,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {ranks.map((rank) => (
            <div key={rank} style={{
              height: cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.notationText,
              fontSize: cellSize * 0.28,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
            }}>
              {rank}
            </div>
          ))}
        </div>

        {/* Right notation (ranks) */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: notationSize,
          width: notationSize,
          height: boardSize,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {ranks.map((rank) => (
            <div key={rank} style={{
              height: cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.notationText,
              fontSize: cellSize * 0.28,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
            }}>
              {rank}
            </div>
          ))}
        </div>

        {/* Top notation (files) */}
        <div style={{
          position: 'absolute',
          left: notationSize,
          top: 0,
          width: boardSize,
          height: notationSize,
          display: 'flex',
          flexDirection: 'row',
        }}>
          {files.map((file) => (
            <div key={file} style={{
              width: cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.notationText,
              fontSize: cellSize * 0.28,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
            }}>
              {file}
            </div>
          ))}
        </div>

        {/* Bottom notation (files) */}
        <div style={{
          position: 'absolute',
          left: notationSize,
          bottom: 0,
          width: boardSize,
          height: notationSize,
          display: 'flex',
          flexDirection: 'row',
        }}>
          {files.map((file) => (
            <div key={file} style={{
              width: cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.notationText,
              fontSize: cellSize * 0.28,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
            }}>
              {file}
            </div>
          ))}
        </div>

        {/* Board squares */}
        <div style={{
          position: 'absolute',
          left: notationSize,
          top: notationSize,
          width: boardSize,
          height: boardSize,
        }}>
          {ranks.map((rank, rowIdx) =>
            files.map((file, colIdx) =>
              renderSquare(file, rank, colIdx, rowIdx)
            )
          )}
        </div>
      </div>

      {/* Drag ghost */}
      {dragState && (
        <img
          src={getPieceSvg(dragState.piece)}
          style={{
            position: 'fixed',
            left: dragState.x - cellSize * 0.45,
            top: dragState.y - cellSize * 0.45,
            width: cellSize * 0.9,
            height: cellSize * 0.9,
            pointerEvents: 'none',
            zIndex: 1000,
            opacity: 0.9,
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
          }}
          draggable={false}
        />
      )}
    </div>
  );
};

export default Board;
