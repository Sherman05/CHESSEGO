import { boardToSerializable } from '../logic/pieces';
import type { Piece, BoardState } from '../logic/pieces';
import type { GameMode, GameStage } from '../stores/gameStore';
import { PieceColor } from '../logic/pieces';

const SESSION_FILE = 'chess-t1-session.json';
const INTRO_KEY = 'chess-t1-intro-skipped';

interface SavedSession {
  board: Record<string, Piece>;
  currentTurn: PieceColor;
  moveNumber: number;
  gameMode: GameMode;
  gameStage: GameStage;
  partyFolder: string | null;
  indicator: string;
}

async function isTauri(): Promise<boolean> {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

export async function saveSession(
  board: BoardState,
  currentTurn: PieceColor,
  moveNumber: number,
  gameMode: GameMode,
  gameStage: GameStage,
  partyFolder: string | null,
  indicator: string
) {
  const data: SavedSession = {
    board: boardToSerializable(board),
    currentTurn,
    moveNumber,
    gameMode,
    gameStage,
    partyFolder,
    indicator,
  };

  try {
    if (await isTauri()) {
      const { writeTextFile, mkdir, exists } = await import('@tauri-apps/plugin-fs');
      const { appDataDir } = await import('@tauri-apps/api/path');
      const dir = await appDataDir();
      if (!(await exists(dir))) {
        await mkdir(dir, { recursive: true });
      }
      await writeTextFile(dir + SESSION_FILE, JSON.stringify(data));
    } else {
      localStorage.setItem(SESSION_FILE, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Failed to save session:', e);
    // Fallback to localStorage
    try { localStorage.setItem(SESSION_FILE, JSON.stringify(data)); } catch {}
  }
}

export async function loadSession(): Promise<SavedSession | null> {
  try {
    if (await isTauri()) {
      const { readTextFile, exists } = await import('@tauri-apps/plugin-fs');
      const { appDataDir } = await import('@tauri-apps/api/path');
      const dir = await appDataDir();
      const path = dir + SESSION_FILE;
      if (await exists(path)) {
        const raw = await readTextFile(path);
        return JSON.parse(raw) as SavedSession;
      }
    } else {
      const raw = localStorage.getItem(SESSION_FILE);
      if (raw) return JSON.parse(raw) as SavedSession;
    }
  } catch {
    // Fallback
    try {
      const raw = localStorage.getItem(SESSION_FILE);
      if (raw) return JSON.parse(raw) as SavedSession;
    } catch {}
  }
  return null;
}

export async function clearSession() {
  try {
    if (await isTauri()) {
      const { remove, exists } = await import('@tauri-apps/plugin-fs');
      const { appDataDir } = await import('@tauri-apps/api/path');
      const path = (await appDataDir()) + SESSION_FILE;
      if (await exists(path)) await remove(path);
    }
  } catch {}
  try { localStorage.removeItem(SESSION_FILE); } catch {}
}

export function setIntroSkipped(skipped: boolean) {
  localStorage.setItem(INTRO_KEY, skipped ? '1' : '0');
}

export function isIntroSkipped(): boolean {
  return localStorage.getItem(INTRO_KEY) === '1';
}
