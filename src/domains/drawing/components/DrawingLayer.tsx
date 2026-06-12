'use client';
import { useDrawingStore } from '../store';
import { useBoardStore } from '@/domains/board/store';

export function DrawingLayer() {
  const { lines, currentLine, removeLine } = useDrawingStore();
  const { mode } = useBoardStore();

  return (
    <div className="absolute inset-0 z-0 touch-none pointer-events-none">
      <svg className={`overflow-visible absolute top-0 left-0 w-full h-full ${mode === 'erase' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {lines.map(line => (
          <g key={line.id} onPointerDown={(e: React.PointerEvent) => {
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
  );
}
