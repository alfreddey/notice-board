import { create } from 'zustand';

export type BoardMode = 'cursor' | 'draw' | 'stamp' | 'erase' | 'pan';

interface BoardState {
  mode: BoardMode;
  panOffset: { x: number; y: number };
  isPanning: boolean;
  stampType: 'star' | 'heart' | 'smiley';
  stampColor: string;
  setMode: (mode: BoardMode) => void;
  setPanOffset: (offset: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setIsPanning: (isPanning: boolean) => void;
  setStampType: (type: 'star' | 'heart' | 'smiley') => void;
  setStampColor: (color: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  mode: 'cursor',
  panOffset: { x: 0, y: 0 },
  isPanning: false,
  stampType: 'heart',
  stampColor: '#fbcfe8',
  setMode: (mode) => set({ mode }),
  setPanOffset: (offset) => set((state) => ({
    panOffset: typeof offset === 'function' ? offset(state.panOffset) : offset
  })),
  setIsPanning: (isPanning) => set({ isPanning }),
  setStampType: (stampType) => set({ stampType }),
  setStampColor: (stampColor) => set({ stampColor }),
}));
