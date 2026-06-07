import { describe, it, expect } from "vitest";
import { libraryService } from "../library-service";
import { Book } from "../../entities/book";

describe("libraryService", () => {
  describe("createBookEntity", () => {
    it("should create a book with default placeholder if content is missing", () => {
      const bookData = {
        title: "Test Book",
        author: "Test Author",
        format: "EPUB" as const,
      };
      
      const book = libraryService.createBookEntity(bookData);
      
      expect(book.title).toBe("Test Book");
      expect(book.author).toBe("Test Author");
      expect(book.content).toContain("Welcome to your Visus Reading Room!");
      expect(book.id).toMatch(/^book-\d+-\d+$/);
    });

    it("should use provided content and metadata", () => {
      const bookData = {
        title: "Real Book",
        author: "Real Author",
        format: "TXT" as const,
        content: "Substantive content here.",
        metadata: {
          description: "A great book.",
          language: "en",
        }
      };
      
      const book = libraryService.createBookEntity(bookData);
      
      expect(book.content).toBe("Substantive content here.");
      expect(book.description).toBe("A great book.");
      expect(book.language).toBe("en");
    });
  });

  describe("calculateProgress", () => {
    it("should update progress and status correctly for digital formats", () => {
      const book: Book = {
        id: "1",
        title: "T",
        author: "A",
        format: "EPUB",
        progress: 0,
        status: "active",
        estimatedReadingTime: "Not started",
        createdAt: "",
      };

      const updated = libraryService.calculateProgress(book, { progress: 50 });
      expect(updated.progress).toBe(50);
      expect(updated.estimatedReadingTime).toBe("50% completed");
      expect(updated.status).toBe("active");

      const completed = libraryService.calculateProgress(book, { progress: 100 });
      expect(completed.progress).toBe(100);
      expect(completed.estimatedReadingTime).toBe("Completed");
      expect(completed.status).toBe("completed");
    });

    it("should handle physical book progress based on pages", () => {
      const book: Book = {
        id: "2",
        title: "P",
        author: "A",
        format: "PHYSICAL",
        progress: 0,
        status: "active",
        estimatedReadingTime: "Not started",
        createdAt: "",
        totalPages: 200,
      };

      const updated = libraryService.calculateProgress(book, { currentPage: 100 });
      expect(updated.progress).toBe(50);
      expect(updated.estimatedReadingTime).toBe("100/200 pages");
    });
  });
});
