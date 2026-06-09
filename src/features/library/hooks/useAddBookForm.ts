import * as React from "react";
import { Book } from "@/core/entities/book";

export function useAddBookForm(
  addBook: (
    title: string,
    author: string,
    format: "PDF" | "EPUB" | "TXT" | "PHYSICAL",
    content?: string,
    chapters?: { title: string; content: string }[],
    metadata?: any,
    fileBlob?: Blob
  ) => void
) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  
  const [newTitle, setNewTitle] = React.useState("");
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newFormat] = React.useState<"PDF" | "EPUB" | "TXT" | "PHYSICAL">("PHYSICAL");
  const [newCoverUrl, setNewCoverUrl] = React.useState("");
  const [newCurrentPage, setNewCurrentPage] = React.useState<number | "">("");
  const [newTotalPages, setNewTotalPages] = React.useState<number | "">("");
  const [newTags, setNewTags] = React.useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addBook(newTitle, newAuthor, newFormat, undefined, undefined, {
      coverUrl: newCoverUrl || undefined,
      genres: newTags ? newTags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
      currentPage: newFormat === "PHYSICAL" && newCurrentPage !== "" ? Number(newCurrentPage) : undefined,
      totalPages: newFormat === "PHYSICAL" && newTotalPages !== "" ? Number(newTotalPages) : undefined,
    });
    
    setNewTitle("");
    setNewAuthor("");
    setNewCoverUrl("");
    setNewCurrentPage("");
    setNewTotalPages("");
    setNewTags("");
    setIsAddModalOpen(false);
  };

  return {
    isAddModalOpen,
    setIsAddModalOpen,
    newTitle,
    setNewTitle,
    newAuthor,
    setNewAuthor,
    newFormat,
    newCoverUrl,
    setNewCoverUrl,
    newCurrentPage,
    setNewCurrentPage,
    newTotalPages,
    setNewTotalPages,
    newTags,
    setNewTags,
    handleAddSubmit
  };
}
