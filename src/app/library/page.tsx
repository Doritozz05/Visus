"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { FancyDropdown } from "@/components/ui/FancyDropdown";
import { useLibrary } from "@/context/library-context";
import { Book } from "@/core/entities/book";
import { useRouter } from "next/navigation";
import { Eraser } from "lucide-react";

import { parseEpub } from "@/lib/parser/epub";
import { parsePdf } from "@/lib/parser/pdf";
import { parseTxt } from "@/lib/parser/txt";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Extracted Sub-Components
import { IngestionDropzone } from "@/features/library/components/IngestionDropzone";
import { AddBookModal } from "@/features/library/components/AddBookModal";
import { EditBookModal } from "@/features/library/components/EditBookModal";
import { BookDetailsModal } from "@/features/library/components/BookDetailsModal";
import { BookCard } from "@/features/library/components/BookCard";

export default function LibraryPage() {
  const { books, addBook, updateBook, deleteBook, toggleCompleted, resetLibrary, setActiveBookId, isHydrated } = useLibrary();
  const router = useRouter();

  // State controls
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"active" | "completed" | "archived">("active");
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [activeGenre, setActiveGenre] = React.useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = React.useState<string | null>(null);
  const [isIngesting, setIsIngesting] = React.useState(false);
  const [detailsBook, setDetailsBook] = React.useState<Book | null>(null);

  // Modal forms state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  
  // Add Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newFormat] = React.useState<"PDF" | "EPUB" | "TXT" | "PHYSICAL">("PHYSICAL");
  const [newCoverUrl, setNewCoverUrl] = React.useState("");
  const [newCurrentPage, setNewCurrentPage] = React.useState<number | "">("");
  const [newTotalPages, setNewTotalPages] = React.useState<number | "">("");
  const [newTags, setNewTags] = React.useState("");

  // Edit Form State
  const [editingBookId, setEditingBookId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editAuthor, setEditAuthor] = React.useState("");
  const [editFormat, setEditFormat] = React.useState<"PDF" | "EPUB" | "TXT" | "PHYSICAL">("EPUB");
  const [editProgress, setEditProgress] = React.useState(0);
  const [editStatus, setEditStatus] = React.useState<"active" | "completed" | "archived">("active");
  const [editCurrentPage, setEditCurrentPage] = React.useState<number | "">("");
  const [editTotalPages, setEditTotalPages] = React.useState<number | "">("");

  const formatOptions = [
    { value: "EPUB", label: "EPUB" },
    { value: "PDF", label: "PDF" },
    { value: "TXT", label: "TXT" },
    { value: "PHYSICAL", label: "PHYSICAL" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
  ];

  // File input ref for browsing files
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Close dropdowns on click outside
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Parse a file name to guess Title and Author
  const parseFileName = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf(".");
    const cleanName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1).toUpperCase() : "TXT";
    
    const validFormat = (extension === "PDF" || extension === "EPUB" || extension === "TXT") 
      ? (extension as "PDF" | "EPUB" | "TXT") 
      : "TXT";

    let title = cleanName;
    let author = "Unknown Author";

    if (cleanName.includes(" - ")) {
      const parts = cleanName.split(" - ");
      title = parts[0].trim();
      author = parts[1].trim();
    } else if (cleanName.includes("_")) {
      const parts = cleanName.split("_");
      title = parts.join(" ").trim();
    }

    return { title, author, format: validFormat };
  };

  const processAndAddFile = async (file: File) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`The file "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). The maximum allowed size is 5.0MB to prevent browser crashes.`);
    }

    const { title, author, format } = parseFileName(file.name);
    
    if (format === "TXT") {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const textContent = event.target?.result as string;
            const parsedChapters = parseTxt(textContent);
            addBook(title, author, format, textContent, parsedChapters);
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
        reader.readAsText(file);
      });
    } else if (format === "PDF") {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const parsed = await parsePdf(arrayBuffer);
            const finalTitle = parsed.title && parsed.title !== "Unknown PDF" ? parsed.title : title;
            const finalAuthor = parsed.author && parsed.author !== "Unknown Author" ? parsed.author : author;
            const fullContent = parsed.chapters.map(c => c.content).join("\n\n");
            addBook(finalTitle, finalAuthor, format, fullContent, parsed.chapters);
            resolve();
          } catch (pdfErr) {
            console.error("PDF Parsing failed:", pdfErr);
            addBook(title, author, format);
            resolve();
          }
        };
        reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
        reader.readAsArrayBuffer(file);
      });
    } else if (format === "EPUB") {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const parsed = await parseEpub(arrayBuffer);
            const finalTitle = parsed.title && parsed.title !== "Unknown Title" ? parsed.title : title;
            const finalAuthor = parsed.author && parsed.author !== "Unknown Author" ? parsed.author : author;
            const fullContent = parsed.chapters.map(c => c.content).join("\n\n");
            addBook(finalTitle, finalAuthor, format, fullContent, parsed.chapters, {
              coverUrl: parsed.coverUrl,
              description: parsed.description,
              genres: parsed.genres,
              publisher: parsed.publisher,
              publishDate: parsed.publishDate,
              language: parsed.language
            });
            resolve();
          } catch (epubErr) {
            console.error("EPUB Parsing failed:", epubErr);
            addBook(title, author, format);
            resolve();
          }
        };
        reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
        reader.readAsArrayBuffer(file);
      });
    } else {
      addBook(title, author, format);
    }
  };

  const processFilesBatch = async (fileList: FileList) => {
    setIsIngesting(true);
    const files = Array.from(fileList);
    
    try {
      const results = await Promise.allSettled(
        files.map(file => processAndAddFile(file))
      );
      
      const failures = results.filter(
        (r): r is PromiseRejectedResult => r.status === "rejected"
      );
      
      if (failures.length > 0) {
        const errorMessages = failures.map(f => f.reason?.message || "Unknown file read error").join("\n");
        alert(`Some files could not be imported:\n${errorMessages}`);
      }
    } catch (err) {
      console.error("Batch file ingestion failed:", err);
    } finally {
      setIsIngesting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Ingestion: File selection handler with FileReader and PDF/EPUB parsing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFilesBatch(files);
  };

  // Ingestion: Drag and drop handlers with PDF/TXT/EPUB extraction
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    await processFilesBatch(files);
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Modal Submit Handlers
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookId || !editTitle.trim()) return;

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
    setIsEditModalOpen(true);
  };

  const handleReadBook = (bookId: string) => {
    setActiveBookId(bookId);
    router.push("/reader");
  };

  // Stats computation
  const completedBooksCount = React.useMemo(() => {
    return books.filter((b) => b.status === "completed").length;
  }, [books]);

  const yearlyGoal = 15;
  const goalProgressPercentage = Math.min(Math.round((completedBooksCount / yearlyGoal) * 100), 100);

  const availableGenres = React.useMemo(() => {
    const genres = new Set<string>();
    books.forEach(b => {
      if (b.genres) {
        b.genres.forEach(g => genres.add(g));
      }
    });
    return Array.from(genres).sort();
  }, [books]);

  // Filter books reactively
  const filteredBooks = React.useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = book.status === activeTab;
      
      const matchesGenre = activeGenre ? book.genres?.includes(activeGenre) : true;
      
      return matchesSearch && matchesTab && matchesGenre;
    });
  }, [books, searchQuery, activeTab, activeGenre]);

  const handleResetFilters = React.useCallback(() => {
    setSearchQuery("");
    setActiveGenre(null);
    setActiveTab("active");
    setActiveDropdownId(null);
  }, []);

  if (!isHydrated) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col md:flex-row antialiased transition-all duration-300">
      <Sidebar activePath="/library" />

      {/* Hidden file input for browsing */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.epub,.txt" 
        multiple
        className="hidden" 
      />

      {/* Mobile TopNav */}
      <nav className="md:hidden bg-card border-b border-border/30 flex justify-between items-center w-full px-6 py-4 z-50 sticky top-0 transition-all duration-300">
        <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary">local_fire_department</span>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-border/30">
            VP
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Header area */}
        <header className="hidden md:flex justify-between items-center px-8 py-6 border-b border-border/20">
          <h1 className="text-3xl font-extrabold font-heading text-foreground">Library</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="material-symbols-outlined text-primary text-sm">local_fire_department</span>
              <span>Streak: 12 days</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
              VP
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 flex-1 max-w-5xl mx-auto w-full">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Ingestion Zone & Progress Stats */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Drag & Drop Upload Panel */}
              <IngestionDropzone
                isDragOver={isDragOver}
                isIngesting={isIngesting}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                triggerFileBrowser={triggerFileBrowser}
              />

              {/* Dynamic Reading Stats */}
              <div className="bg-card rounded-xl border border-border/20 p-6 shadow-xl glass-panel relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 relative z-10">Books read</h2>
                <div className="flex justify-between items-end mb-2 relative z-10">
                  <span className="text-3xl font-extrabold font-heading text-foreground">
                    {completedBooksCount}
                    <span className="text-sm text-muted-foreground/80 font-normal ml-1">/ {yearlyGoal}</span>
                  </span>
                  <span className="text-[10px] font-mono text-primary font-bold">{goalProgressPercentage}% Yearly goal</span>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden relative z-10 border border-border/10">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500 group-hover:brightness-110" 
                    style={{ width: `${goalProgressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 relative z-10 leading-relaxed font-sans">
                  {completedBooksCount >= yearlyGoal 
                    ? "Congratulations! You reached your yearly goal! Keep setting new milestones."
                    : `Doing great! Next milestone is just ${Math.max(1, yearlyGoal - completedBooksCount)} book${yearlyGoal - completedBooksCount > 1 ? "s" : ""} away.`}
                </p>
              </div>

            </div>

            {/* Right Column: Search, Filters & Book List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Search, Filter Tabs & Add Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-card rounded-xl border border-border/20 p-2 shadow-xl glass-panel">
                <div className="flex-1 flex items-center px-4 gap-2 w-full">
                  <span className="material-symbols-outlined text-muted-foreground">search</span>
                  <input 
                    className="w-full bg-transparent border-none text-sm text-foreground focus:outline-none focus:ring-0 placeholder-muted-foreground/60 h-10" 
                    placeholder="Search by title or author..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center w-full sm:w-auto px-2 shrink-0">
                  <div className="flex bg-background/50 border border-border/10 p-1 rounded-lg">
                    {[
                      { id: "active", label: "Active" },
                      { id: "completed", label: "Completed" },
                      { id: "archived", label: "Archived" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
                          activeTab === tab.id
                            ? "bg-accent text-primary font-bold shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-9 h-9 shrink-0 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 transition-all shadow-md"
                    title="Add book manually"
                  >
                    <span className="material-symbols-outlined text-xl">add</span>
                  </button>
                </div>
              </div>

              {/* Tags/Genres Filter */}
              {availableGenres.length > 0 && (
                <div className="flex gap-2 px-2 items-center flex-wrap w-full">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground shrink-0">Filter by tag:</span>
                  <div className="w-full sm:w-[20rem] md:w-[24rem] lg:w-[28rem] shrink-0">
                    <FancyDropdown
                      value={activeGenre || ""}
                      onChange={(nextValue) => setActiveGenre(nextValue || null)}
                      placeholder="All tags"
                      ariaLabel="Filter books by tag"
                      align="start"
                      searchable
                      searchPlaceholder="Search tags..."
                      maxMenuHeightClassName="max-h-64"
                      options={[
                        { value: "", label: "All tags" },
                        ...availableGenres.map((genre) => ({
                          value: genre,
                          label: genre,
                        })),
                      ]}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="h-9 w-9 shrink-0 rounded-lg border border-border/40 bg-card/80 text-muted-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-accent/80 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-center"
                    aria-label="Reset filters"
                    title="Reset filters"
                  >
                    <Eraser className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Book List Scrollable Grid Panel */}
              <div className="relative flex-1 max-h-[58vh]">
                <div className="max-h-[58vh] overflow-y-auto scrollbar-none scroll-fade-bottom pr-1 pb-10">
                  {filteredBooks.length === 0 ? (
                    <div className="border border-dashed border-border/40 rounded-xl flex flex-col items-center justify-center p-12 text-center bg-card/10 h-full min-h-[300px]">
                      <span className="material-symbols-outlined text-4xl text-muted-foreground/60 mb-3">library_books</span>
                      <p className="text-sm font-semibold text-muted-foreground">No books found</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs leading-relaxed">
                        Try adjusting your search criteria, switching tabs, or uploading a new file in the ingestion area.
                      </p>
                      {books.length === 0 && (
                        <button
                          onClick={resetLibrary}
                          className="mt-4 px-3 py-1.5 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/5 hover:bg-primary/10 rounded transition-all"
                        >
                          Reload seed data
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredBooks.map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          activeDropdownId={activeDropdownId}
                          setActiveDropdownId={setActiveDropdownId}
                          onDelete={deleteBook}
                          onToggleCompleted={toggleCompleted}
                          onEdit={openEditModal}
                          onUpdateBook={updateBook}
                          onRead={handleReadBook}
                          onDetails={setDetailsBook}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* --- ADD BOOK DIALOG MODAL --- */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newAuthor={newAuthor}
        setNewAuthor={setNewAuthor}
        newCoverUrl={newCoverUrl}
        setNewCoverUrl={setNewCoverUrl}
        newTags={newTags}
        setNewTags={setNewTags}
        newCurrentPage={newCurrentPage}
        setNewCurrentPage={setNewCurrentPage}
        newTotalPages={newTotalPages}
        setNewTotalPages={setNewTotalPages}
      />

      {/* --- EDIT BOOK DIALOG MODAL --- */}
      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editAuthor={editAuthor}
        setEditAuthor={setEditAuthor}
        editFormat={editFormat}
        setEditFormat={setEditFormat}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        editCurrentPage={editCurrentPage}
        setEditCurrentPage={setEditCurrentPage}
        editTotalPages={editTotalPages}
        setEditTotalPages={setEditTotalPages}
        editProgress={editProgress}
        setEditProgress={setEditProgress}
        formatOptions={formatOptions}
        statusOptions={statusOptions}
      />

      {/* --- PREMIUM BOOK DETAILS MODAL OVERLAY --- */}
      {detailsBook && (
        <BookDetailsModal
          book={detailsBook}
          onClose={() => setDetailsBook(null)}
          onReadBook={handleReadBook}
        />
      )}

    </div>
  );
}
