/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as React from "react";
import { BookCard } from "../BookCard";
import { Book as BookEntity } from "@/core/entities/book";

// Mock Supabase to avoid environment variable errors during tests
vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(() => ({})),
}));

vi.mock("@/lib/supabase", () => ({
  createClient: vi.fn(() => ({})),
  supabase: {},
}));

// Mock ReadingListContext since BookCard now depends on it via AddToListDialog
vi.mock("@/features/library/context/reading-list-context", () => ({
  useReadingList: () => ({
    lists: [],
    addBookToList: vi.fn(),
    removeBookFromList: vi.fn(),
  }),
}));

// Mock ContextMenu to avoid portal issues in simple unit tests
vi.mock("@/components/ui/ContextMenu", () => ({
  useContextMenu: () => ({
    showMenu: vi.fn(),
  }),
}));

// Mock Image from next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe("BookCard", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockBook: BookEntity = {
    id: "book-1",
    title: "Test Book",
    author: "Test Author",
    format: "EPUB",
    progress: 45,
    status: "active",
    estimatedReadingTime: "2 hours",
    createdAt: new Date().toISOString(),
    ownerId: "user-1",
    genres: ["Fiction", "Sci-Fi"]
  };

  const defaultProps = {
    book: mockBook,
    activeDropdownId: null,
    setActiveDropdownId: vi.fn(),
    onDelete: vi.fn(),
    onToggleCompleted: vi.fn(),
    onEdit: vi.fn(),
    onUpdateBook: vi.fn(),
    onRead: vi.fn(),
    onDetails: vi.fn(),
  };

  it("renders book information correctly", () => {
    render(<BookCard {...defaultProps} />);
    
    expect(screen.getByText("Test Book")).toBeDefined();
    expect(screen.getByText("Test Author")).toBeDefined();
    expect(screen.getByText("45%")).toBeDefined();
  });

  it("calls onRead when Read Book is clicked", () => {
    render(<BookCard {...defaultProps} />);
    const readBtn = screen.getByTitle("Read book");
    fireEvent.click(readBtn);
    expect(defaultProps.onRead).toHaveBeenCalledWith("book-1");
  });

  it("shows delete confirmation on trash click", () => {
    render(<BookCard {...defaultProps} />);
    const deleteBtn = screen.getByTitle("Delete book");
    fireEvent.click(deleteBtn);
    
    expect(screen.getByText("Delete volume?")).toBeDefined();
  });

  it("opens internal dropdown when trigger is clicked", () => {
    const setActiveDropdownId = vi.fn();
    render(<BookCard {...defaultProps} setActiveDropdownId={setActiveDropdownId} />);
    
    // The button has aria-haspopup="true"
    const moreButton = screen.getByRole("button", { expanded: false });
    
    fireEvent.click(moreButton);
    expect(setActiveDropdownId).toHaveBeenCalledWith("book-1");
  });
});
