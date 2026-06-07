import * as React from "react";
import { Book } from "@/core/entities/book";

interface UseReaderBookmarksProps {
  activeBook: Book | null;
  updateBook: (id: string, updates: Partial<Book>) => void;
  chaptersData: { title: string; content: string; index: number }[];
  setIsPlaying: (playing: boolean) => void;
  setActiveChapterIndex: (index: number) => void;
  setWordIndex: (w: number) => void;
  saveProgressForBook: (bookId: string, chIdx: number, wIdx: number) => void;
}

export function useReaderBookmarks({
  activeBook,
  updateBook,
  chaptersData,
  setIsPlaying,
  setActiveChapterIndex,
  setWordIndex,
  saveProgressForBook,
}: UseReaderBookmarksProps) {
  // Add a new named bookmark and persist it
  const handleAddBookmark = React.useCallback((name: string, chapterIndex: number, wordIndex: number) => {
    if (!activeBook) return;
    const currentBookmarks = activeBook.bookmarks || [];
    
    // Find chapter title
    const chapterTitle = chaptersData[chapterIndex]?.title || `Section ${chapterIndex + 1}`;
    
    const newBookmark = {
      id: `bookmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      chapterIndex,
      wordIndex,
      name,
      createdAt: new Date().toISOString(),
      chapterTitle,
    };
    
    updateBook(activeBook.id, {
      bookmarks: [...currentBookmarks, newBookmark],
    });
  }, [activeBook, chaptersData, updateBook]);

  // Remove an existing bookmark
  const handleRemoveBookmark = React.useCallback((id: string) => {
    if (!activeBook) return;
    const currentBookmarks = activeBook.bookmarks || [];
    updateBook(activeBook.id, {
      bookmarks: currentBookmarks.filter((b) => b.id !== id),
    });
  }, [activeBook, updateBook]);

  // Update a bookmark's custom name
  const handleUpdateBookmarkName = React.useCallback((id: string, name: string) => {
    if (!activeBook) return;
    const currentBookmarks = activeBook.bookmarks || [];
    updateBook(activeBook.id, {
      bookmarks: currentBookmarks.map((b) => (b.id === id ? { ...b, name } : b)),
    });
  }, [activeBook, updateBook]);

  // Jump to any saved bookmark position
  const handleGoToBookmark = React.useCallback((chapterIndex: number, wordIndex: number) => {
    setIsPlaying(false);
    setActiveChapterIndex(chapterIndex);
    setWordIndex(wordIndex);
    if (activeBook) {
      saveProgressForBook(activeBook.id, chapterIndex, wordIndex);
    }
  }, [activeBook, saveProgressForBook, setIsPlaying, setActiveChapterIndex, setWordIndex]);

  return {
    handleAddBookmark,
    handleRemoveBookmark,
    handleUpdateBookmarkName,
    handleGoToBookmark,
  };
}
