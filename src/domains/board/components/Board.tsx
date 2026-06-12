'use client';
import { useBoardStore } from '../store';
import { useDrawingStore } from '@/domains/drawing/store';
import { useStickersStore } from '@/domains/stickers/store';

export function Board({ children }: { children: React.ReactNode }) {
  const { mode, isPanning, setIsPanning, setPanOffset, panOffset, stampType, stampColor } = useBoardStore();
  const { penColor, brushSize, setCurrentLine, currentLine, addLine } = useDrawingStore();
  const { addSticker } = useStickersStore();

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 1 || mode === 'pan') {
      setIsPanning(true);
      if (typeof e.currentTarget.setPointerCapture === 'function') {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      return;
    }
    
    if (e.button !== 0) return;
    if (mode === 'draw') {
      const x = e.clientX - panOffset.x;
      const y = e.clientY - panOffset.y;
      setCurrentLine({ id: Date.now().toString(), points: [{ x, y }], color: penColor, width: brushSize });
    } else if (mode === 'stamp') {
      const x = e.clientX - panOffset.x;
      const y = e.clientY - panOffset.y;
      addSticker({
        id: Date.now().toString(),
        type: stampType,
        x,
        y,
        rotation: (Math.random() - 0.5) * 60,
        scale: 0.8 + Math.random() * 0.5,
        color: stampColor
      });
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
      addLine(currentLine);
      setCurrentLine(null);
    }
  };

  return (
    <div 
      className={`fixed inset-0 overflow-hidden font-kalam text-slate-800 touch-none select-none flex flex-col ${isPanning ? 'cursor-grabbing' : mode === 'erase' ? 'cursor-alias' : mode === 'pan' ? 'cursor-grab' : mode !== 'cursor' ? 'cursor-crosshair' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none z-0 opacity-60">
        <defs>
          <pattern id="grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform={`translate(${panOffset.x}, ${panOffset.y})`}>
            <path d="M 0,0 L 0,80" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
            <path d="M 0,0 L 80,0" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="absolute inset-0 z-0 origin-top-left pointer-events-none" style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}>
        {children}
      </div>
    </div>
  );
}
