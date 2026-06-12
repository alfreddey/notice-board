'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStickersStore } from '../store';
import { useBoardStore } from '@/domains/board/store';
import { SketchyStar, SketchyHeart, SketchySmiley } from '@/shared/components/SketchyShapes';

export function StickerLayer() {
  const { stickers, setStickers, removeSticker } = useStickersStore();
  const { mode } = useBoardStore();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none">
      <AnimatePresence>
        {stickers.map((sticker) => (
          <motion.div
            drag={mode === 'cursor'}
            dragMomentum={false}
            onDragStart={() => {
              setDraggingId(sticker.id);
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
            onPointerDown={(e: React.PointerEvent) => {
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
  );
}
