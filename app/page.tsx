'use client';
import { useSyncStorage } from '@/shared/hooks/use-sync-storage';
import { Board } from '@/domains/board/components/Board';
import { BoardToolbar } from '@/domains/board/components/BoardToolbar';
import { DrawingLayer } from '@/domains/drawing/components/DrawingLayer';
import { NotesLayer } from '@/domains/notes/components/NotesLayer';
import { AddNoteForm } from '@/domains/notes/components/AddNoteForm';
import { StickerLayer } from '@/domains/stickers/components/StickerLayer';

export default function Page() {
  const isLoaded = useSyncStorage();

  if (!isLoaded) return null;

  return (
    <>
      <Board>
        <DrawingLayer />
        <StickerLayer />
        <NotesLayer />
      </Board>
      <AddNoteForm />
      <BoardToolbar />
    </>
  );
}

