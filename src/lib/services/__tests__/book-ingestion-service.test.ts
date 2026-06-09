import { describe, it, expect, vi } from "vitest";
import { parseFileName, parseUploadedFile, MAX_FILE_SIZE } from "../book-ingestion-service";
import { parseTxt } from "@/lib/parser/txt";
import { parsePdf } from "@/lib/parser/pdf";
import { parseEpub } from "@/lib/parser/epub";

vi.mock("@/lib/parser/txt", () => ({
  parseTxt: vi.fn(),
}));

vi.mock("@/lib/parser/pdf", () => ({
  parsePdf: vi.fn(),
}));

vi.mock("@/lib/parser/epub", () => ({
  parseEpub: vi.fn(),
}));

describe("book-ingestion-service", () => {
  describe("parseFileName", () => {
    it("should parse title and author correctly with ' - ' separator", () => {
      const { title, author, format } = parseFileName("Isaac Asimov - Foundation.epub");
      expect(title).toBe("Isaac Asimov");
      expect(author).toBe("Foundation");
      expect(format).toBe("EPUB");
    });

    it("should handle underscore separators", () => {
      const { title, author } = parseFileName("The_Old_Man_and_the_Sea.txt");
      expect(title).toBe("The Old Man and the Sea");
      expect(author).toBe("Unknown Author");
    });

    it("should default to TXT for unknown extensions", () => {
      const { format } = parseFileName("document.xyz");
      expect(format).toBe("TXT");
    });
  });

  describe("parseUploadedFile", () => {
    it("should throw error if file is too large", async () => {
      const largeFile = new File([""], "large.epub");
      Object.defineProperty(largeFile, 'size', { value: MAX_FILE_SIZE + 1 });

      await expect(parseUploadedFile(largeFile)).rejects.toThrow(/too large/);
    });

    it("should parse TXT files correctly", async () => {
      const content = "Hello world";
      const file = new File([content], "test.txt", { type: "text/plain" });
      vi.mocked(parseTxt).mockReturnValue([{ title: "Chapter 1", content: "Hello world" }]);

      const result = await parseUploadedFile(file);
      expect(result.title).toBe("test");
      expect(result.format).toBe("TXT");
      expect(result.content).toBe(content);
      expect(result.chapters).toHaveLength(1);
    });

    // Note: PDF and EPUB testing would require mocking FileReader and ArrayBuffer reads more deeply
    // or using a more integrated test approach. For unit tests, we've mocked the parsers.
  });
});
