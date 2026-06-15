"use client";

import * as React from "react";
import { ReadingList } from "@/core/entities/reading-list";
import { ReadingListService } from "@/core/services/reading-list-service";
import { useAuth } from "@/features/auth/context/auth-context";
import { toast } from "sonner";

interface ReadingListContextType {
  lists: ReadingList[];
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  createList: (name: string, color?: string) => Promise<void>;
  updateList: (list: ReadingList) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  addBookToList: (listId: string, bookId: string) => Promise<void>;
  removeBookFromList: (listId: string, bookId: string) => Promise<void>;
  isLoading: boolean;
}

const ReadingListContext = React.createContext<ReadingListContextType | undefined>(undefined);

export function ReadingListProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [lists, setLists] = React.useState<ReadingList[]>([]);
  const [activeListId, setActiveListId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const ownerId = user?.id || "local";

  const loadLists = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ReadingListService.getAllLists(ownerId);
      setLists(data);
    } catch (err) {
      console.error("Failed to load reading lists:", err);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  React.useEffect(() => {
    loadLists();
  }, [loadLists]);

  const createList = async (name: string, color?: string) => {
    try {
      const newList = await ReadingListService.createList(name, ownerId, color);
      setLists((prev) => [...prev, newList]);
      toast.success(`List "${name}" created.`);
    } catch (err) {
      toast.error("Error creating list.");
    }
  };

  const updateList = async (list: ReadingList) => {
    try {
      await ReadingListService.updateList(list);
      setLists((prev) => prev.map((l) => (l.id === list.id ? list : l)));
    } catch (err) {
      toast.error("Error updating list.");
    }
  };

  const deleteList = async (id: string) => {
    try {
      await ReadingListService.deleteList(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
      if (activeListId === id) setActiveListId(null);
      toast.success("List deleted.");
    } catch (err) {
      toast.error("Error deleting list.");
    }
  };

  const addBookToList = async (listId: string, bookId: string) => {
    try {
      await ReadingListService.addBookToList(listId, bookId);
      await loadLists(); // Refresh to get updated bookIds
      toast.success("Book added to list.");
    } catch (err) {
      toast.error("Error adding book to list.");
    }
  };

  const removeBookFromList = async (listId: string, bookId: string) => {
    try {
      await ReadingListService.removeBookFromList(listId, bookId);
      await loadLists(); // Refresh
      toast.success("Book removed from list.");
    } catch (err) {
      toast.error("Error removing book from list.");
    }
  };

  return (
    <ReadingListContext.Provider
      value={{
        lists,
        activeListId,
        setActiveListId,
        createList,
        updateList,
        deleteList,
        addBookToList,
        removeBookFromList,
        isLoading,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = React.useContext(ReadingListContext);
  if (context === undefined) {
    throw new Error("useReadingList must be used within a ReadingListProvider");
  }
  return context;
}
