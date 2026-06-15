import * as React from "react";
import { Book } from "@/core/entities/book";

export function useEditBookForm(
  updateBook: (id: string, updates: Partial<Book>, silent?: boolean) => void
) {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingBookId, setEditingBookId] = React.useState<string | null>(null);
  
  const [editTitle, setEditTitle] = React.useState("");
  const [editAuthor, setEditAuthor] = React.useState("");
  const [editFormat, setEditFormat] = React.useState<"PDF" | "EPUB" | "TXT" | "PHYSICAL">("EPUB");
  const [editProgress, setEditProgress] = React.useState(0);
  const [editStatus, setEditStatus] = React.useState<"active" | "completed">("active");
  const [editCurrentPage, setEditCurrentPage] = React.useState<number | "">("");
  const [editTotalPages, setEditTotalPages] = React.useState<number | "">("");
  const [titleError, setTitleError] = React.useState<string | undefined>(undefined);

  const formatOptions = [
    { value: "EPUB", label: "EPUB" },
    { value: "PDF", label: "PDF" },
    { value: "TXT", label: "TXT" },
    { value: "PHYSICAL", label: "PHYSICAL" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookId) return;

    if (!editTitle.trim()) {
      setTitleError("Title cannot be empty.");
      return;
    }

    const updates: Partial<Book> = {
      title: editTitle.trim(),
      author: editAuthor.trim() || "Unknown Author",
      format: editFormat,
      status: editStatus,
    };
    
    if (editFormat === "PHYSICAL") {
      updates.currentPage = editCurrentPage !== "" ? Number(editCurrentPage) : undefined;
      updates.totalPages = editTotalPages !== "" ? Number(editTotalPages) : undefined;
    } else {
      updates.progress = editProgress;
      updates.estimatedReadingTime = editProgress === 100 
        ? "Completed" 
        : editProgress > 0 
          ? `${Math.ceil((100 - editProgress) * 0.15)}h remaining at 450 WPM`
          : "Not started";
    }

    updateBook(editingBookId, updates);

    setIsEditModalOpen(false);
    setEditingBookId(null);
    setTitleError(undefined);
  };

  const openEditModal = (book: Book) => {
    setEditingBookId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditFormat(book.format);
    setEditProgress(book.progress);
    setEditStatus(book.status);
    setEditCurrentPage(book.currentPage ?? "");
    setEditTotalPages(book.totalPages ?? "");
    setTitleError(undefined);
    setIsEditModalOpen(true);
  };

  const updateTitle = (val: string) => {
    setEditTitle(val);
    if (val.trim()) setTitleError(undefined);
  };

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    editTitle,
    setEditTitle: updateTitle,
    editAuthor,
    setEditAuthor,
    editFormat,
    setEditFormat,
    editStatus,
    setEditStatus,
    editCurrentPage,
    setEditCurrentPage,
    editTotalPages,
    setEditTotalPages,
    editProgress,
    setEditProgress,
    formatOptions,
    statusOptions,
    titleError,
    handleEditSubmit,
    openEditModal
  };
}
