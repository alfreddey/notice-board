'use client';
import { useState } from 'react';
import { useBoardStore } from '../store';
import { useDrawingStore } from '@/domains/drawing/store';
import { useStickersStore } from '@/domains/stickers/store';
import { useNotesStore } from '@/domains/notes/store';
import { PEN_COLORS, STICKER_COLORS } from '@/shared/constants';
import { 
  SketchyBox, SketchyCircle, SketchyCursor, SketchyHand, 
  SketchyPen, SketchyHeart, SketchyEraser, SketchyLine, 
  SketchyStar, SketchySmiley, SketchyUndo, SketchyButtonBg, SketchyTrash 
} from '@/shared/components/SketchyShapes';

export function BoardToolbar() {
  const { mode, setMode, stampType, setStampType, stampColor, setStampColor } = useBoardStore();
  const { lines, penColor, setPenColor, brushSize, setBrushSize, undoDraw, clearLines } = useDrawingStore();
  const { stickers, undoSticker, clearStickers } = useStickersStore();
  const { clearNotes } = useNotesStore();

  // Syncing stamp type explicitly wait we need to fix stampType not being in store ?
  // Actually, we pass stamp type implicitly or we should put it in StickersStore. 
  // Wait, stamp parameters were in App state before, we should move them to BoardStore.
  // I will just put it in BoardStore via multi_edit_file later, or use this component as the source.
  // Actually, I can update the app/page.tsx to pass stamp type to stickers via PointerDown on Board wrapper?
  // Let's just update `useBoardStore` to include stamp settings.

  const handleClearBoard = () => {
    if (confirm('Clear the whole board?')) {
      clearNotes();
      clearLines();
      clearStickers();
    }
  };

  return (
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
            onClick={handleClearBoard}
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
  );
}
