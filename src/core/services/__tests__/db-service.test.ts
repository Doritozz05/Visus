import { describe, it, expect, beforeEach, vi } from "vitest";
import "fake-indexeddb/auto";
import { dbService } from "../db-service";
import { Book } from "../../entities/book";

describe("DbService", () => {
  beforeEach(async () => {
    // Reset IndexedDB for each test
    const { indexedDB } = await import("fake-indexeddb");
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
        if (db.name) {
            await new Promise((resolve) => {
                const req = indexedDB.deleteDatabase(db.name!);
                req.onsuccess = resolve;
                req.onerror = resolve;
            });
        }
    }
  });

  it("should save and retrieve books metadata", async () => {
    const book: Book = {
      id: "book-1",
      title: "Test Book",
      author: "Author",
      format: "EPUB",
      progress: 0,
      estimatedReadingTime: "Not started",
      status: "active",
      createdAt: new Date().toISOString(),
      ownerId: "user-1"
    };

    await dbService.saveBook(book);
    const retrieved = await dbService.getBook("book-1");
    
    expect(retrieved).toEqual(book);
  });

  it("should retrieve all books for a specific owner", async () => {
    const book1: Book = {
        id: "book-1",
        title: "Book 1",
        author: "A",
        format: "EPUB",
        progress: 0,
        estimatedReadingTime: "Not started",
        status: "active",
        createdAt: "",
        ownerId: "user-1"
    };
    const book2: Book = {
        id: "book-2",
        title: "Book 2",
        author: "B",
        format: "TXT",
        progress: 0,
        estimatedReadingTime: "Not started",
        status: "active",
        createdAt: "",
        ownerId: "user-2"
    };

    await dbService.saveBook(book1);
    await dbService.saveBook(book2);

    const user1Books = await dbService.getAllBooks("user-1");
    expect(user1Books).toHaveLength(1);
    expect(user1Books[0].id).toBe("book-1");
  });

  it("should handle sync queue operations", async () => {
    const action = {
        type: "UPDATE_BOOK" as const,
        payload: { id: "1", title: "Updated" },
        timestamp: new Date().toISOString()
    };

    await dbService.enqueueSyncAction(action);
    const queue = await dbService.getSyncQueue();
    
    expect(queue).toHaveLength(1);
    expect(queue[0].payload.title).toBe("Updated");

    await dbService.removeSyncAction(queue[0].id!);
    const emptyQueue = await dbService.getSyncQueue();
    expect(emptyQueue).toHaveLength(0);
  });

  it("should save and retrieve binary data", async () => {
    const binary = {
        bookId: "book-1",
        content: "Binary test content",
        format: "EPUB"
    };

    await dbService.saveBookBinary(binary as any);
    const retrieved = await dbService.getBookBinary("book-1");
    
    expect(retrieved?.bookId).toBe("book-1");
    expect(retrieved?.content).toBe("Binary test content");
  });
});
