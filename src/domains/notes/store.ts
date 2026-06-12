import { create } from 'zustand';

export interface Note {
  id: string;
  text: string;
  color: string;
  rotation: number;
  completed?: boolean;
  x: number;
  y: number;
  zIndex: number;
  pinned?: boolean;
}

interface NotesState {
  notes: Note[];
  setNotes: (notes: Note[] | ((prev: Note[]) => Note[])) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  bringToFront: (id: string) => void;
  toggleComplete: (id: string) => void;
  togglePin: (id: string) => void;
  clearNotes: () => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  setNotes: (notesOrFn) => set((state) => ({ 
    notes: typeof notesOrFn === 'function' ? notesOrFn(state.notes) : notesOrFn 
  })),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map((n) => n.id === id ? { ...n, ...updates } : n)
  })),
  removeNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
  bringToFront: (id) => set((state) => {
    const maxZ = state.notes.length > 0 ? Math.max(...state.notes.map(n => n.zIndex || 0)) : 0;
    return {
      notes: state.notes.map(n => n.id === id ? { ...n, zIndex: maxZ + 1 } : n)
    };
  }),
  toggleComplete: (id) => set((state) => ({
    notes: state.notes.map(n => n.id === id ? { ...n, completed: !n.completed } : n)
  })),
  togglePin: (id) => set((state) => ({
    notes: state.notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
  })),
  clearNotes: () => set({ notes: [] })
}));
