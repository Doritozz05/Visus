import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBookIngestion } from "../useBookIngestion";
import { parseUploadedFile } from "@/lib/services/book-ingestion-service";
import { calculateFileHash } from "@/lib/utils";

vi.mock("@/lib/services/book-ingestion-service", () => ({
  parseUploadedFile: vi.fn(),
}));

vi.mock("@/lib/utils", () => ({
  calculateFileHash: vi.fn(),
  cn: vi.fn((...args) => args.filter(Boolean).join(" ")),
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

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await act(async () => {
      await result.current.handleFileChange({
        target: { files: mockFileList }
      } as any);
    });

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("already in your library"));
  });
});
