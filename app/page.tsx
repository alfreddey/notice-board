'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SketchyBox, 
  SketchyButtonBg, 
  SketchyStar, 
  SketchyTrash, 
  SketchyLine,
  SketchyCircle,
  SketchyStrike,
  SketchyCheck,
  SketchyPen,
  SketchyUndo,
  SketchyCursor,
  SketchyHeart,
  SketchyEraser,
  SketchyPencil,
  SketchySmiley,
  SketchyPushPin,
  SketchyHand
} from '@/components/SketchyShapes';

interface Note {
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

type Point = { x: number; y: number };
interface Line {
  id: string;
  points: Point[];
  color: string;
  width: number;
}

interface Sticker {
  id: string;
  type: 'star' | 'heart' | 'smiley';
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

const COLORS = [
  '#fef08a', // yellow
  '#bbf7d0', // green
  '#bfdbfe', // blue
  '#fbcfe8', // pink
  '#fed7aa', // orange
  '#e9d5ff', // purple
];

const PEN_COLORS = [
  '#1e293b', // slate-800
  '#ef4444', // red
  '#3b82f6', // blue
];

const STICKER_COLORS = [
  '#fbcfe8', // pink
  '#fef08a', // yellow
  '#bbf7d0', // green
  '#bfdbfe', // blue
];

const STORAGE_KEY = 'doodle-board-data';

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  
  const [newNote, setNewNote] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [mode, setMode] = useState<'cursor' | 'draw' | 'stamp' | 'erase' | 'pan'>('cursor');
  const [penColor, setPenColor] = useState(PEN_COLORS[0]);
  const [brushSize, setBrushSize] = useState<number>(4);
  const [stampType, setStampType] = useState<'star' | 'heart' | 'smiley'>('heart');
  const [stampColor, setStampColor] = useState(STICKER_COLORS[0]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed = false;
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotes(data.notes || []);
        setLines(data.lines || []);
        setStickers(data.stickers || []);
        parsed = true;
      } catch (e) {
        console.error('Failed to parse board data:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    if (!parsed) {
      setNotes([
        { id: '1', text: 'Drink water!', color: '#bbf7d0', rotation: -2, x: 100, y: 300, zIndex: 1 },
        { id: '2', text: 'Call mom 📞\nTell her I love her', color: '#fbcfe8', rotation: 3, x: 400, y: 250, zIndex: 2 },
        { id: '3', text: 'Build an app made entirely of SVGs', color: '#fef08a', rotation: -1, x: 250, y: 450, zIndex: 3 },
      ]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, lines, stickers }));
    }
  }, [notes, lines, stickers, isLoaded]);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const maxZ = notes.length > 0 ? Math.max(...notes.map(n => n.zIndex || 0)) : 0;
    
    // Position slightly offset from center
    const rx = typeof window !== 'undefined' ? (window.innerWidth / 2 - 150 + (Math.random() - 0.5) * 100) - panOffset.x : 200 - panOffset.x;
    const ry = typeof window !== 'undefined' ? (window.innerHeight / 2 - 150 + (Math.random() - 0.5) * 100) - panOffset.y : 200 - panOffset.y;
    
    setNotes([
      ...notes, 
      {
        id: Date.now().toString(),
        text: newNote,
        color: selectedColor,
        rotation: (Math.random() - 0.5) * 6,
        completed: false,
        x: rx,
        y: ry,
        zIndex: maxZ + 1,
      }
    ]);
    setNewNote('');
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const removeLine = (id: string) => {
    setLines(lines.filter(l => l.id !== id));
  };

  const removeSticker = (id: string) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  const toggleComplete = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, completed: !n.completed } : n));
  };

  const bringToFront = (id: string) => {
    const maxZ = notes.length > 0 ? Math.max(...notes.map(n => n.zIndex || 0)) : 0;
    setNotes(notes.map(n => n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const clearBoard = () => {
    if (confirm('Clear the whole board?')) {
      setNotes([]);
      setLines([]);
      setStickers([]);
    }
  };

  const undoDraw = () => setLines(prev => prev.slice(0, -1));
  const undoSticker = () => setStickers(prev => prev.slice(0, -1));

  // Drawing Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Middle click triggers pan temporarily
    if (e.button === 1 || mode === 'pan') {
      setIsPanning(true);
      if (typeof e.currentTarget.setPointerCapture === 'function') {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      return;
    }
    
    // Left click only to draw
    if (e.button !== 0) return;
    if (mode === 'draw') {
      const x = e.clientX - panOffset.x;
      const y = e.clientY - panOffset.y;
      setCurrentLine({ id: Date.now().toString(), points: [{ x, y }], color: penColor, width: brushSize });
    } else if (mode === 'stamp') {
      const x = e.clientX - panOffset.x;
      const y = e.clientY - panOffset.y;
      setStickers([...stickers, {
        id: Date.now().toString(),
        type: stampType,
        x,
        y,
        rotation: (Math.random() - 0.5) * 60,
        scale: 0.8 + Math.random() * 0.5,
        color: stampColor
      }]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPanOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
      return;
    }

    if (mode !== 'draw' || !currentLine) return;
    const x = e.clientX - panOffset.x;
    const y = e.clientY - panOffset.y;
    setCurrentLine({
      ...currentLine,
      points: [...currentLine.points, { x, y }]
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      if (typeof e.currentTarget.releasePointerCapture === 'function') {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      return;
    }

    if (currentLine) {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
    }
  };

  if (!isLoaded) return null;

  return (
    <div 
      className={`fixed inset-0 overflow-hidden font-kalam text-slate-800 touch-none select-none flex flex-col ${isPanning ? 'cursor-grabbing' : mode === 'erase' ? 'cursor-alias' : mode === 'pan' ? 'cursor-grab' : mode !== 'cursor' ? 'cursor-crosshair' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background Pattern - Sketchy Grid */}
      <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none z-0 opacity-60">
        <defs>
          <pattern id="grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform={`translate(${panOffset.x}, ${panOffset.y})`}>
            <path d="M 0,0 L 0,80" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
            <path d="M 0,0 L 80,0" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Pan Wrapper for Canvas Content */}
      <div className="absolute inset-0 z-0 origin-top-left pointer-events-none" style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}>
        {/* Drawing Canvas layer */}
        <div className="absolute inset-0 z-0 touch-none pointer-events-none">
          <svg className={`overflow-visible absolute top-0 left-0 w-full h-full ${mode === 'erase' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {lines.map(line => (
              <g key={line.id} onPointerDown={(e) => {
                if (mode === 'erase') {
                  e.stopPropagation();
                  removeLine(line.id);
                }
              }} className={mode === 'erase' ? 'cursor-pointer hover:opacity-50' : 'pointer-events-none'}>
              {mode === 'erase' && (
                <polyline 
                  points={line.points.map(p => `${p.x},${p.y}`).join(' ')} 
                  fill="none" 
                  stroke="transparent" 
                  strokeWidth={line.width + 20} 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}
              <polyline 
                points={line.points.map(p => `${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={line.color} 
                strokeWidth={line.width} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </g>
          ))}
          {currentLine && (
            <polyline 
              points={currentLine.points.map(p => `${p.x},${p.y}`).join(' ')} 
              fill="none" 
              stroke={currentLine.color} 
              strokeWidth={currentLine.width} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          )}
        </svg>
      </div>

      {/* Draggable Stickers Layer */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <AnimatePresence>
          {stickers.map((sticker) => (
            <motion.div
              drag={mode === 'cursor'}
              dragMomentum={false}
              onDragStart={() => {
                setDraggingId(sticker.id);
                // optionally bring to front
                setStickers(prev => {
                  const s = prev.find(st => st.id === sticker.id);
                  return s ? [...prev.filter(st => st.id !== sticker.id), s] : prev;
                });
              }}
              onDragEnd={(e, info) => {
                setDraggingId(null);
                const nx = sticker.x + info.offset.x;
                const ny = sticker.y + info.offset.y;
                const newRotation = (Math.random() - 0.5) * 60;
                setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, x: nx, y: ny, rotation: newRotation } : s));
              }}
              initial={{ x: sticker.x - 50, y: sticker.y - 50, opacity: 0, scale: 0, rotate: sticker.rotation - 45 }}
              animate={{ x: sticker.x - 50, y: sticker.y - 50, opacity: 1, scale: sticker.scale, rotate: sticker.rotation }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 350, mass: 0.8 }}
              whileDrag={{ 
                scale: sticker.scale * 1.25, 
                rotate: sticker.rotation + 10,
                zIndex: 999
              }}
              whileHover={mode === 'cursor' ? { scale: sticker.scale * 1.1 } : undefined}
              key={sticker.id}
              onPointerDown={(e) => {
                if (mode === 'erase') {
                  e.stopPropagation();
                  removeSticker(sticker.id);
                }
              }}
              className={`absolute top-0 left-0 w-[100px] h-[100px] flex items-center justify-center transition-opacity ${mode === 'erase' ? 'pointer-events-auto cursor-pointer hover:opacity-50' : mode === 'cursor' ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''}`}
            >
              {sticker.type === 'star' ? (
                <SketchyStar className="w-full h-full" fillColor={sticker.color} strokeColor="#000" style={{ filter: draggingId === sticker.id ? 'drop-shadow(10px 15px 12px rgba(0,0,0,0.3))' : 'drop-shadow(2px 3px 3px rgba(0,0,0,0.15))', transition: 'filter 0.2s' }} />
              ) : sticker.type === 'smiley' ? (
                <SketchySmiley className="w-full h-full" fillColor={sticker.color} strokeColor="#000" style={{ filter: draggingId === sticker.id ? 'drop-shadow(10px 15px 12px rgba(0,0,0,0.3))' : 'drop-shadow(2px 3px 3px rgba(0,0,0,0.15))', transition: 'filter 0.2s' }} />
              ) : (
                <SketchyHeart className="w-full h-full" fillColor={sticker.color} style={{ filter: draggingId === sticker.id ? 'drop-shadow(10px 15px 12px rgba(0,0,0,0.3))' : 'drop-shadow(2px 3px 3px rgba(0,0,0,0.15))', transition: 'filter 0.2s' }} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Draggable Sticky Notes Layer */}
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
                const newRotation = (Math.random() - 0.5) * 8; // Random drop angle
                setNotes(prev => prev.map(n => n.id === note.id ? { ...n, x: nx, y: ny, rotation: newRotation } : n));
              }}
              initial={{ x: note.x, y: note.y, opacity: 0, scale: 0.8, rotate: note.rotation - 15 }}
              animate={{ x: note.x, y: note.y, opacity: 1, scale: 1, rotate: note.rotation }}
              exit={{ opacity: 0, scale: 0.8, rotate: note.rotation + 15 }}
              transition={{ type: 'spring', damping: 14, stiffness: 350, mass: 0.8 }}
              whileHover={mode === 'cursor' && !note.pinned ? { scale: 1.02, rotate: note.rotation + 1 } : undefined}
              whileDrag={{ 
                scale: 1.08, 
                rotate: note.rotation - 4, 
                zIndex: 999 
              }}
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
              
              {/* Tape on top */}
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
                        setNotes(notes.map(n => n.id === note.id ? { ...n, color: c } : n));
                      }} className="relative w-6 h-6 wobble-hover outline-none">
                         <SketchyCircle fillColor={c} strokeColor={note.color === c ? '#000' : 'transparent'} className={`absolute inset-0 w-full h-full -z-10 ${note.color === c ? 'scale-125' : ''}`} />
                      </button>
                    ))}
                    <button 
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        setNotes(notes.map(n => n.id === editingId ? { ...n, text: editingText } : n));
                        setEditingId(null);
                      }} 
                      className="ml-auto w-8 h-8 p-1 text-green-600 wobble-hover flex items-center justify-center"
                    >
                       <SketchyCheck strokeColor="#16a34a" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 relative z-10 text-xl leading-relaxed mt-4 stroke-linecap-round font-medium break-words overflow-hidden cursor-text" onDoubleClick={() => {
                  setEditingId(note.id);
                  setEditingText(note.text);
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
      </div>

      {/* Top Floating UI (Title & Form) */}
      <div className="absolute top-4 inset-x-0 z-50 flex flex-col items-center pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-2 relative z-10 text-center pointer-events-auto">
          <SketchyStar className="w-10 h-10 inline-block -mt-4 animate-[spin_10s_linear_infinite]" />
          Doodle Board
          <SketchyStar className="w-6 h-6 inline-block -mt-8 text-pink-300 animate-[spin_8s_linear_infinite_reverse]" fillColor="#fbcfe8" />
        </h1>
        
        <form onSubmit={addNote} className="w-full max-w-lg relative p-4 wobble-hover group z-20 pointer-events-auto">
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

      {/* Bottom Toolbox */}
      <div className="absolute bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none">
        <div className="relative p-2 md:p-3 flex gap-4 md:gap-6 items-center pointer-events-auto group max-w-full overflow-x-auto shadow-xl rounded-2xl mx-4">
          <SketchyBox fillColor="#fff" strokeColor="#334155" />
          
          <div className="flex gap-2">
            <button 
              title="Cursor"
              onClick={() => setMode('cursor')}
              className={`relative w-12 h-12 p-3 wobble-hover transition-transform ${mode === 'cursor' ? 'scale-110' : 'opacity-70'}`}
            >
              <SketchyCircle className="absolute inset-0 w-full h-full -z-10" fillColor={mode === 'cursor' ? '#fef08a' : '#f1f5f9'} strokeColor="#1e293b" />
              <SketchyCursor className="w-full h-full relative z-10 pointer-events-none" strokeColor="#1e293b" />
            </button>

            <button 
              title="Pan"
              onClick={() => setMode('pan')}
              className={`relative w-12 h-12 p-3 wobble-hover transition-transform ${mode === 'pan' ? 'scale-110' : 'opacity-70'}`}
            >
              <SketchyCircle className="absolute inset-0 w-full h-full -z-10" fillColor={mode === 'pan' ? '#fef08a' : '#f1f5f9'} strokeColor="#1e293b" />
              <SketchyHand className="w-full h-full relative z-10 pointer-events-none" strokeColor="#1e293b" />
            </button>

            <button 
              title="Draw"
              onClick={() => setMode('draw')}
              className={`relative w-12 h-12 p-3 wobble-hover transition-transform ${mode === 'draw' ? 'scale-110' : 'opacity-70'}`}
            >
              <SketchyCircle className="absolute inset-0 w-full h-full -z-10" fillColor={mode === 'draw' ? '#fef08a' : '#f1f5f9'} strokeColor="#1e293b" />
              <SketchyPen className="w-full h-full relative z-10 pointer-events-none" strokeColor="#1e293b" />
            </button>

            <button 
              title="Stamp"
              onClick={() => setMode('stamp')}
              className={`relative w-12 h-12 p-3 wobble-hover transition-transform ${mode === 'stamp' ? 'scale-110' : 'opacity-70'}`}
            >
              <SketchyCircle className="absolute inset-0 w-full h-full -z-10" fillColor={mode === 'stamp' ? '#fef08a' : '#f1f5f9'} strokeColor="#1e293b" />
              <SketchyHeart className="w-full h-full relative z-10 pointer-events-none" strokeColor="#1e293b" fillColor={mode === 'stamp' ? '#fbcfe8' : 'transparent'} />
            </button>

            <button 
              title="Erase"
              onClick={() => setMode('erase')}
              className={`relative w-12 h-12 p-3 wobble-hover transition-transform ${mode === 'erase' ? 'scale-110' : 'opacity-70'}`}
            >
              <SketchyCircle className="absolute inset-0 w-full h-full -z-10" fillColor={mode === 'erase' ? '#fee2e2' : '#f1f5f9'} strokeColor="#1e293b" />
              <SketchyEraser className="w-full h-full relative z-10 pointer-events-none p-0.5" strokeColor="#1e293b" />
            </button>
          </div>

          {(mode === 'draw' || mode === 'stamp') && (
            <div className="flex items-center gap-2 border-l-2 border-slate-300 pl-4 border-dashed relative">
               <SketchyLine className="absolute left-0 top-0 bottom-0 w-1 text-slate-300 h-full -ml-[2px]" strokeColor="currentColor" />
               <div className="absolute top-1/2 -left-2 w-4 h-full"></div>
              
              {mode === 'draw' && PEN_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPenColor(c)}
                  className="w-8 h-8 relative wobble-hover cursor-pointer"
                >
                  <SketchyCircle fillColor={c} strokeColor={penColor === c ? '#000' : 'transparent'} className={`absolute inset-0 w-full h-full -z-10 ${penColor === c ? 'scale-125' : ''}`} />
                </button>
              ))}

              {mode === 'draw' && (
                <div className="flex gap-2 ml-2 border-l border-slate-200 pl-2">
                  {[2, 4, 8].map(size => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`w-8 h-8 flex items-center justify-center wobble-hover ${brushSize === size ? 'opacity-100 scale-110 drop-shadow' : 'opacity-40'}`}
                    >
                      <div className="rounded-full bg-slate-800" style={{ width: size + 2, height: size + 2 }}></div>
                    </button>
                  ))}
                </div>
              )}

              {mode === 'stamp' && STICKER_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setStampColor(c)}
                  className="w-8 h-8 relative wobble-hover cursor-pointer"
                >
                  <SketchyCircle fillColor={c} strokeColor={stampColor === c ? '#000' : 'transparent'} className={`absolute inset-0 w-full h-full -z-10 ${stampColor === c ? 'scale-125' : ''}`} />
                </button>
              ))}

              {mode === 'stamp' && (
                <div className="flex gap-2 ml-2 border-l border-slate-200 pl-2">
                  <button onClick={() => setStampType('heart')} className={`w-8 h-8 p-1 wobble-hover ${stampType === 'heart' ? 'scale-110 drop-shadow' : 'opacity-60'}`}>
                    <SketchyHeart fillColor={stampColor} strokeColor="#000" />
                  </button>
                  <button onClick={() => setStampType('star')} className={`w-8 h-8 p-1 wobble-hover ${stampType === 'star' ? 'scale-110 drop-shadow' : 'opacity-60'}`}>
                    <SketchyStar fillColor={stampColor} strokeColor="#000" />
                  </button>
                  <button onClick={() => setStampType('smiley')} className={`w-8 h-8 p-1 wobble-hover ${stampType === 'smiley' ? 'scale-110 drop-shadow' : 'opacity-60'}`}>
                    <SketchySmiley fillColor={stampColor} strokeColor="#000" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="w-1 h-8 opacity-20 relative ml-2">
             <SketchyLine className="w-full h-full text-slate-800" strokeColor="currentColor" />
          </div>

          <div className="flex gap-2 ml-2">
            {(mode === 'draw' ? lines.length > 0 : mode === 'stamp' ? stickers.length > 0 : false) && (
               <button 
                 onClick={mode === 'draw' ? undoDraw : undoSticker}
                 className="relative w-10 h-10 p-2 text-slate-700 wobble-hover"
                 title={`Undo ${mode === 'draw' ? 'Draw' : 'Stamp'}`}
               >
                 <SketchyUndo className="w-full h-full pointer-events-none" strokeColor="currentColor" />
               </button>
            )}

            <button 
              onClick={clearBoard}
              className="relative px-3 py-1 font-bold text-red-600 wobble-hover ml-2"
            >
              <SketchyButtonBg fillColor="#fee2e2" strokeColor="#ef4444" />
              <span className="relative z-10 flex items-center gap-1 text-sm md:text-base">
                <SketchyTrash className="w-4 h-4 pointer-events-none" strokeColor="currentColor" />
                Clear
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
