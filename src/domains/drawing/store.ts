import { create } from 'zustand';

export type Point = { x: number; y: number };
export interface Line {
  id: string;
  points: Point[];
  color: string;
  width: number;
}

interface DrawingState {
  lines: Line[];
  currentLine: Line | null;
  penColor: string;
  brushSize: number;
  setLines: (lines: Line[] | ((prev: Line[]) => Line[])) => void;
  setCurrentLine: (line: Line | null) => void;
  setPenColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  addLine: (line: Line) => void;
  removeLine: (id: string) => void;
  undoDraw: () => void;
  clearLines: () => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  lines: [],
  currentLine: null,
  penColor: '#1e293b',
  brushSize: 4,
  setLines: (linesOrFn) => set((state) => ({
    lines: typeof linesOrFn === 'function' ? linesOrFn(state.lines) : linesOrFn
  })),
  setCurrentLine: (line) => set({ currentLine: line }),
  setPenColor: (color) => set({ penColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),
  removeLine: (id) => set((state) => ({ lines: state.lines.filter(l => l.id !== id) })),
  undoDraw: () => set((state) => ({ lines: state.lines.slice(0, -1) })),
  clearLines: () => set({ lines: [] })
}));
