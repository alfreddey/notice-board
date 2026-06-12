'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotesStore } from '../store';
import { useBoardStore } from '@/domains/board/store';
import { COLORS } from '@/shared/constants';
import { SketchyBox, SketchyPushPin, SketchyCircle, SketchyCheck, SketchyStrike, SketchyPencil, SketchyTrash } from '@/shared/components/SketchyShapes';

export function NotesLayer() {
  const { notes, setNotes, updateNote, removeNote, bringToFront, toggleComplete, togglePin } = useNotesStore();
  const { mode } = useBoardStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            drag={mode === 'cursor' && !note.pinned}
            dragMomentum={false}
            onDragStart={() => {
              if (!note.pinned) {
                bringToFront(note.id);
                setDraggingId(note.id);
              }
            }}
            onDragEnd={(e, info) => {
              setDraggingId(null);
              if (note.pinned) return;
              const nx = note.x + info.offset.x;
              const ny = note.y + info.offset.y;
              const newRotation = (Math.random() - 0.5) * 8;
              updateNote(note.id, { x: nx, y: ny, rotation: newRotation });
            }}
            initial={{ x: note.x, y: note.y, opacity: 0, scale: 0.8, rotate: note.rotation - 15 }}
            animate={{ x: note.x, y: note.y, opacity: 1, scale: 1, rotate: note.rotation }}
            exit={{ opacity: 0, scale: 0.8, rotate: note.rotation + 15 }}
            transition={{ type: 'spring', damping: 14, stiffness: 350, mass: 0.8 }}
            whileHover={mode === 'cursor' && !note.pinned ? { scale: 1.02, rotate: note.rotation + 1 } : undefined}
            whileDrag={{ scale: 1.08, rotate: note.rotation - 4, zIndex: 999 }}
            key={note.id}
            onClick={() => {
              if (mode === 'erase') removeNote(note.id);
            }}
            className={`absolute top-0 left-0 w-64 p-6 min-h-[220px] flex flex-col group transition-opacity ${mode === 'erase' ? 'cursor-pointer hover:opacity-50 pointer-events-auto' : mode === 'cursor' ? (note.pinned ? 'pointer-events-auto' : 'cursor-grab active:cursor-grabbing pointer-events-auto') : 'pointer-events-none'} ${note.completed && mode !== 'erase' ? 'opacity-80' : ''}`}
            style={{ zIndex: note.zIndex } as any}
          >
            <div className="absolute inset-0 pointer-events-none z-[-1]" style={{ filter: draggingId === note.id ? "drop-shadow(15px 25px 20px rgba(0,0,0,0.25))" : "drop-shadow(2px 5px 6px rgba(0,0,0,0.15))", transition: "filter 0.2s" }}>
              <SketchyBox fillColor={note.color} strokeColor="#000" />
            </div>
            
            {note.pinned && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 z-[30] pointer-events-none drop-shadow-md">
                 <SketchyPushPin strokeColor="#000" fillColor="#ef4444" />
              </div>
            )}
            
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 opacity-60 z-10 pointer-events-none" style={{ transform: `rotate(${note.rotation * -3}deg)` }}>
               <SketchyBox fillColor="#cbd5e1" strokeColor="transparent" className="opacity-70 mix-blend-multiply" />
            </div>
            
            {editingId === note.id ? (
              <div className="flex-1 relative z-10 flex flex-col mt-4">
                <textarea
                  autoFocus
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 w-full bg-transparent border-none outline-none resize-none font-kalam text-xl leading-relaxed p-0 focus:ring-0 whitespace-pre-wrap"
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
                <div className="flex items-center gap-1 mt-2 z-20 pointer-events-auto">
                  {COLORS.map(c => (
                    <button key={c} onPointerDown={(e) => { 
                      e.stopPropagation(); 
                      updateNote(note.id, { color: c });
                    }} className="relative w-6 h-6 wobble-hover outline-none">
                       <SketchyCircle fillColor={c} strokeColor={note.color === c ? '#000' : 'transparent'} className={`absolute inset-0 w-full h-full -z-10 ${note.color === c ? 'scale-125' : ''}`} />
                    </button>
                  ))}
                  <button 
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      updateNote(editingId, { text: editingText });
                      setEditingId(null);
                    }} 
                    className="ml-auto w-8 h-8 p-1 text-green-600 wobble-hover flex items-center justify-center"
                  >
                     <SketchyCheck strokeColor="#16a34a" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 relative z-10 text-xl leading-relaxed mt-4 stroke-linecap-round font-medium break-words overflow-hidden cursor-text" onDoubleClick={(e) => {
                if (mode === 'cursor') {
                  setEditingId(note.id);
                  setEditingText(note.text);
                }
              }}>
                {note.text}
                {note.completed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 z-20">
                     <SketchyStrike className="w-full h-4 text-slate-800" strokeColor="currentColor" />
                  </div>
                )}
              </div>
            )}

            {editingId !== note.id && (
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pl-2 pt-2 bg-gradient-to-tl from-black/5 to-transparent rounded-full">
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingId(note.id); setEditingText(note.text); }}
                  className="relative w-10 h-10 p-2 wobble-hover outline-none"
                  aria-label="Edit"
                >
                  <SketchyBox fillColor="#bae6fd" strokeColor="#0284c7" />
                  <SketchyPencil className="w-full h-full relative z-10 pointer-events-none p-0.5" strokeColor="#0369a1" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleComplete(note.id); }}
                  className="relative w-10 h-10 p-2 wobble-hover outline-none"
                  aria-label="Toggle Complete"
                >
                  <SketchyCircle className="absolute inset-0 w-full h-full -z-10" fillColor="#dcfce7" strokeColor="#16a34a" />
                  <SketchyCheck className="w-full h-full relative z-10 pointer-events-none p-1" strokeColor="#16a34a" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                  className={`relative w-10 h-10 p-2 wobble-hover outline-none ${note.pinned ? 'opacity-100' : 'opacity-70'}`}
                  aria-label="Toggle Pin"
                >
                  <SketchyBox fillColor={note.pinned ? "#fecaca" : "#f1f5f9"} strokeColor={note.pinned ? "#ef4444" : "#94a3b8"} />
                  <SketchyPushPin className="w-full h-full relative z-10 pointer-events-none p-1" strokeColor={note.pinned ? "#ef4444" : "#64748b"} fillColor={note.pinned ? "#ef4444" : "transparent"} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeNote(note.id); }}
                  className="relative w-10 h-10 p-2 wobble-hover outline-none"
                  aria-label="Delete"
                >
                  <SketchyBox fillColor="#fee2e2" strokeColor="#ef4444" />
                  <SketchyTrash className="w-full h-full relative z-10 pointer-events-none" strokeColor="#ef4444" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
