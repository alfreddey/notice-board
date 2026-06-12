import { create } from 'zustand';

export interface Sticker {
  id: string;
  type: 'star' | 'heart' | 'smiley';
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

interface StickersState {
  stickers: Sticker[];
  setStickers: (stickers: Sticker[] | ((prev: Sticker[]) => Sticker[])) => void;
  addSticker: (sticker: Sticker) => void;
  updateSticker: (id: string, updates: Partial<Sticker>) => void;
  removeSticker: (id: string) => void;
  undoSticker: () => void;
  clearStickers: () => void;
}

export const useStickersStore = create<StickersState>((set) => ({
  stickers: [],
  setStickers: (stickersOrFn) => set((state) => ({
    stickers: typeof stickersOrFn === 'function' ? stickersOrFn(state.stickers) : stickersOrFn
  })),
  addSticker: (sticker) => set((state) => ({ stickers: [...state.stickers, sticker] })),
  updateSticker: (id, updates) => set((state) => ({
    stickers: state.stickers.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  removeSticker: (id) => set((state) => ({ stickers: state.stickers.filter(s => s.id !== id) })),
  undoSticker: () => set((state) => ({ stickers: state.stickers.slice(0, -1) })),
  clearStickers: () => set({ stickers: [] })
}));
