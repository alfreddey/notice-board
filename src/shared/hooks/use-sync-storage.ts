import { useEffect, useState } from 'react';
import { useNotesStore } from '@/domains/notes/store';
import { useDrawingStore } from '@/domains/drawing/store';
import { useStickersStore } from '@/domains/stickers/store';
import { OLD_STORAGE_KEY } from '@/shared/constants';

export function useSyncStorage() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { notes, setNotes } = useNotesStore();
  const { lines, setLines } = useDrawingStore();
  const { stickers, setStickers } = useStickersStore();

  useEffect(() => {
    const saved = localStorage.getItem(OLD_STORAGE_KEY);
    let parsed = false;
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNotes(data.notes || []);
        setLines(data.lines || []);
        setStickers(data.stickers || []);
        parsed = true;
      } catch (e) {
        console.error('Failed to parse board data:', e);
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    }
    
    if (!parsed) {
      setNotes([
        { id: '1', text: 'Drink water!', color: '#bbf7d0', rotation: -2, x: 100, y: 300, zIndex: 1 },
        { id: '2', text: 'Call mom 📞\nTell her I love her', color: '#fbcfe8', rotation: 3, x: 400, y: 250, zIndex: 2 },
        { id: '3', text: 'Build an app made entirely of SVGs', color: '#fef08a', rotation: -1, x: 250, y: 450, zIndex: 3 },
      ]);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, [setNotes, setLines, setStickers]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(OLD_STORAGE_KEY, JSON.stringify({ notes, lines, stickers }));
    }
  }, [notes, lines, stickers, isLoaded]);

  return isLoaded;
}
