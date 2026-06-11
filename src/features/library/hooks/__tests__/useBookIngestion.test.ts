import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBookIngestion } from "../useBookIngestion";
import { parseUploadedFile } from "@/lib/services/book-ingestion-service";
import { calculateFileHash } from "@/lib/utils";
import { toast } from "sonner";

vi.mock("@/lib/services/book-ingestion-service", () => ({
  parseUploadedFile: vi.fn(),
}));

vi.mock("@/lib/utils", () => ({
  calculateFileHash: vi.fn(),
  cn: vi.fn((...args) => args.filter(Boolean).join(" ")),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe("useBookIngestion", () => {
  const mockAddBook = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useBookIngestion(mockAddBook));
    expect(result.current.isDragOver).toBe(false);
    expect(result.current.isIngesting).toBe(false);
  });

  it("should handle drag over and leave", () => {
    const { result } = renderHook(() => useBookIngestion(mockAddBook));
    
    act(() => {
      result.current.handleDragOver({ preventDefault: vi.fn() } as any);
    });
    expect(result.current.isDragOver).toBe(true);

    act(() => {
      result.current.handleDragLeave();
    });
    expect(result.current.isDragOver).toBe(false);
  });

  it("should process files on drop", async () => {
    const { result } = renderHook(() => useBookIngestion(mockAddBook));
    const mockFile = new File(["test"], "test.txt");
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: (index: number) => mockFile,
      [Symbol.iterator]: function* () { yield mockFile; }
    } as any;

    vi.mocked(parseUploadedFile).mockResolvedValue({
      title: "Test Title",
      author: "Test Author",
      format: "TXT",
      content: "test",
      fileBlob: mockFile,
    });
    vi.mocked(calculateFileHash).mockResolvedValue("hash-123");
    mockAddBook.mockReturnValue("new-id");

    await act(async () => {
      await result.current.handleDrop({
        preventDefault: vi.fn(),
        dataTransfer: { files: mockFileList }
      } as any);
    });

    expect(mockAddBook).toHaveBeenCalledWith(
      "Test Title",
      "Test Author",
      "TXT",
      "test",
      undefined,
      undefined,
      mockFile,
      "hash-123"
    );
    expect(result.current.isIngesting).toBe(false);
  });

  it("should handle duplicates during ingestion", async () => {
    const { result } = renderHook(() => useBookIngestion(mockAddBook));
    const mockFile = new File(["test"], "test.txt");
    const mockFileList = [mockFile] as any;
    mockFileList.item = (i: number) => mockFile;

    vi.mocked(parseUploadedFile).mockResolvedValue({
      title: "Duplicate",
      author: "Author",
      format: "TXT",
      fileBlob: mockFile,
    });
    mockAddBook.mockReturnValue(null); // Indicates duplicate

    await act(async () => {
      await result.current.handleFileChange({
        target: { files: mockFileList }
      } as any);
    });

    expect(toast.info).toHaveBeenCalledWith("This book is already in your library");
  });

  it("should handle mixed success and duplicates in batch ingestion", async () => {
    const { result } = renderHook(() => useBookIngestion(mockAddBook));
    const file1 = new File(["test1"], "test1.txt");
    const file2 = new File(["test2"], "test2.txt");
    const mockFileList = {
      0: file1,
      1: file2,
      length: 2,
      item: (index: number) => (index === 0 ? file1 : file2),
      [Symbol.iterator]: function* () {
        yield file1;
        yield file2;
      },
    } as any;

    vi.mocked(parseUploadedFile).mockImplementation(async (file) => ({
      title: file.name,
      author: "Author",
      format: "TXT",
      fileBlob: file as File,
    }));

    mockAddBook
      .mockReturnValueOnce("id1") // Success for file1
      .mockReturnValueOnce(null); // Duplicate for file2

    await act(async () => {
      await result.current.handleFileChange({
        target: { files: mockFileList },
      } as any);
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Book imported successfully. 1 duplicate was skipped."
    );
  });
});
