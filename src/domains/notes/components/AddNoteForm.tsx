'use client';
import { useState } from 'react';
import { useNotesStore } from '../store';
import { useBoardStore } from '@/domains/board/store';
import { COLORS } from '@/shared/constants';
import { SketchyStar, SketchyBox, SketchyLine, SketchyCircle, SketchyButtonBg } from '@/shared/components/SketchyShapes';

export function AddNoteForm() {
  const { addNote, notes } = useNotesStore();
  const { panOffset } = useBoardStore();
  const [newNote, setNewNote] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const maxZ = notes.length > 0 ? Math.max(...notes.map(n => n.zIndex || 0)) : 0;
    
    const rx = typeof window !== 'undefined' ? (window.innerWidth / 2 - 150 + (Math.random() - 0.5) * 100) - panOffset.x : 200 - panOffset.x;
    const ry = typeof window !== 'undefined' ? (window.innerHeight / 2 - 150 + (Math.random() - 0.5) * 100) - panOffset.y : 200 - panOffset.y;
    
    addNote({
      id: Date.now().toString(),
      text: newNote,
      color: selectedColor,
      rotation: (Math.random() - 0.5) * 6,
      completed: false,
      x: rx,
      y: ry,
      zIndex: maxZ + 1,
    });
    setNewNote('');
  };

  return (
    <div className="absolute top-4 inset-x-0 z-50 flex flex-col items-center pointer-events-none">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-2 relative z-10 text-center pointer-events-auto">
        <SketchyStar className="w-10 h-10 inline-block -mt-4 animate-[spin_10s_linear_infinite]" />
        Doodle Board
        <SketchyStar className="w-6 h-6 inline-block -mt-8 text-pink-300 animate-[spin_8s_linear_infinite_reverse]" fillColor="#fbcfe8" />
      </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg relative p-4 wobble-hover group z-20 pointer-events-auto">
        <SketchyBox fillColor="#fff" strokeColor="#334155" />
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="New thought..."
              className="w-full bg-transparent border-none outline-none text-xl font-kalam placeholder:text-slate-400 p-2"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1 hidden group-focus-within:block">
               <SketchyLine className="w-full h-full text-slate-400" strokeColor="currentColor" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className="w-6 h-6 relative wobble-hover cursor-pointer"
                  aria-label={`Select color ${c}`}
                >
                   <SketchyCircle fillColor={c} strokeColor={selectedColor === c ? '#000' : 'transparent'} className={`absolute inset-0 w-full h-full -z-10 ${selectedColor === c ? 'scale-110' : ''}`} />
                </button>
              ))}
            </div>
            <button 
              type="submit"
              className="relative px-4 py-2 font-bold wobble-hover disabled:opacity-50"
              disabled={!newNote.trim()}
            >
              <SketchyButtonBg fillColor="#fde047" strokeColor="#000" />
              <span className="relative z-10">Add</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
