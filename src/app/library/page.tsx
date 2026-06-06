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

export default function LibraryPage() {
  const { books, addBook, updateBook, deleteBook, toggleCompleted, resetLibrary, activeBookId, setActiveBookId } = useLibrary();
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
  const [newFormat, setNewFormat] = React.useState<"PDF" | "EPUB" | "TXT" | "PHYSICAL">("PHYSICAL");
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
      alert(`The file "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). The maximum allowed size is 5.0MB to prevent browser crashes.`);
      return;
    }

    const { title, author, format } = parseFileName(file.name);
    
    if (format === "TXT") {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const textContent = event.target?.result as string;
          const parsedChapters = parseTxt(textContent);
          addBook(title, author, format, textContent, parsedChapters);
          resolve();
        };
        reader.readAsText(file);
      });
    } else if (format === "PDF") {
      return new Promise<void>((resolve) => {
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
        reader.readAsArrayBuffer(file);
      });
    } else if (format === "EPUB") {
      return new Promise<void>((resolve) => {
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
        reader.readAsArrayBuffer(file);
      });
    } else {
      addBook(title, author, format);
    }
  };

  // Ingestion: File selection handler with FileReader and PDF/EPUB parsing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsIngesting(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await processAndAddFile(files[i]);
      }
    } catch (err) {
      console.error("File ingestion failed:", err);
    } finally {
      setIsIngesting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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

    setIsIngesting(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await processAndAddFile(files[i]);
      }
    } catch (err) {
      console.error("Drag and drop ingestion failed:", err);
    } finally {
      setIsIngesting(false);
    }
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
    setNewFormat("PHYSICAL");
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
      // Progress calculation is handled in useLibrary
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
              <span>Streak: 12 Days</span>
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
              <div className="bg-card border border-border/20 rounded-xl p-6 flex flex-col flex-1 relative overflow-hidden group shadow-xl glass-panel min-h-[360px] lg:min-h-[calc(58vh-4rem)]">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50"></div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 relative z-10">Ingestion</h2>
                
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileBrowser}
                  className={`border border-dashed border-border/50 rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 relative z-10 cursor-pointer ${
                    isDragOver 
                      ? "border-primary bg-accent/60 shadow-[inset_0_0_15px_rgba(var(--primary),0.1)] scale-[0.98]" 
                      : "bg-background/80 hover:bg-accent/40 hover:border-primary/50"
                  }`}
                  id="drop-zone"
                >
                  {isIngesting ? (
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-primary mb-3 animate-spin">sync</span>
                      <p className="text-sm font-semibold text-foreground mb-1">Extracting text...</p>
                      <p className="text-[10px] font-mono text-muted-foreground/80">Parsing foveal elements</p>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-muted-foreground mb-3 group-hover:text-primary transition-colors animate-pulse">upload_file</span>
                      <p className="text-sm font-semibold text-foreground mb-1">Drag & drop files here</p>
                      <p className="text-[10px] font-mono text-muted-foreground/80">PDF, EPUB, TXT formats supported</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); triggerFileBrowser(); }}
                        className="mt-6 px-4 py-2 border border-border/40 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary transition-all rounded bg-card/90"
                      >
                        Browse files
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Reading Stats */}
              <div className="bg-card rounded-xl border border-border/20 p-6 shadow-xl glass-panel relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 relative z-10">Books read</h2>
                <div className="flex justify-between items-end mb-2 relative z-10">
                  <span className="text-3xl font-extrabold font-heading text-foreground">
                    {completedBooksCount}
                    <span className="text-sm text-muted-foreground/80 font-normal ml-1">/ {yearlyGoal}</span>
                  </span>
                  <span className="text-[10px] font-mono text-primary font-bold">{goalProgressPercentage}% Yearly Goal</span>
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
                    title="Add Book Manually"
                  >
                    <span className="material-symbols-outlined text-xl">add</span>
                  </button>
                </div>
              </div>

              {/* Tags/Genres Filter */}
              {availableGenres.length > 0 && (
                <div className="flex gap-2 px-2 items-center flex-wrap w-full">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground shrink-0">Filter by Tag:</span>
                  <div className="w-full sm:w-[20rem] md:w-[24rem] lg:w-[28rem] shrink-0">
                    <FancyDropdown
                      value={activeGenre || ""}
                      onChange={(nextValue) => setActiveGenre(nextValue || null)}
                      placeholder="All Tags"
                      ariaLabel="Filter books by tag"
                      align="start"
                      searchable
                      searchPlaceholder="Search tags..."
                      maxMenuHeightClassName="max-h-64"
                      options={[
                        { value: "", label: "All Tags" },
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
                        <div
                          key={book.id}
                          className="bg-card border border-border/20 rounded-xl p-5 flex flex-col justify-between relative hover:border-primary/50 transition-all shadow-md glass-panel min-h-[160px]"
                        >
                          {/* Option Actions Row */}
                          <div className="absolute top-4 right-4 flex items-center gap-1 z-20">
                            {/* Direct Trash Icon Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBook(book.id);
                              }}
                              className="w-7 h-7 rounded-full hover:bg-rose-500/10 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-all animate-fade-in"
                              title="Delete Book"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>

                            {/* Options Dropdown Trigger */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownId(activeDropdownId === book.id ? null : book.id);
                                }}
                                className="w-7 h-7 rounded-full hover:bg-accent/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                              >
                                <span className="material-symbols-outlined text-base">more_vert</span>
                              </button>

                              {/* Dropdown Menu (floats dynamically outside card, NEVER clipped, completely opaque) */}
                              {activeDropdownId === book.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-8 z-30 w-52 overflow-hidden rounded-2xl border border-border/40 bg-card/95 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl animate-fade-in opacity-100"
                                >
                                  <button
                                    onClick={() => {
                                      setDetailsBook(book);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-accent/80 flex items-center gap-2.5 hover:text-primary transition-colors border-b border-border/10"
                                  >
                                    <span className="material-symbols-outlined text-sm text-muted-foreground">info</span>
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      toggleCompleted(book.id);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-accent/80 flex items-center gap-2.5 hover:text-primary transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-sm text-muted-foreground">
                                      {book.status === "completed" ? "unpublished" : "task_alt"}
                                    </span>
                                    {book.status === "completed" ? "Mark as Active" : "Mark as Completed"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      openEditModal(book);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-accent/80 flex items-center gap-2.5 hover:text-primary transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-sm text-muted-foreground">edit</span>
                                    Edit Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      updateBook(book.id, { status: book.status === "archived" ? "active" : "archived" });
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-accent/80 flex items-center gap-2.5 hover:text-primary transition-colors border-t border-border/10"
                                  >
                                    <span className="material-symbols-outlined text-sm text-muted-foreground">
                                      {book.status === "archived" ? "unarchive" : "archive"}
                                    </span>
                                    {book.status === "archived" ? "Unarchive Book" : "Archive Book"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Info Cover Row */}
                          <div className="flex gap-4 items-start pr-16 mb-4">
                            <div className="w-12 h-16 bg-gradient-to-br from-primary/10 to-primary/5 border border-border/30 rounded-lg flex items-center justify-center shrink-0 relative shadow-inner overflow-hidden cursor-pointer" onClick={() => setDetailsBook(book)}>
                              {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full bg-accent/30">
                                  <span className="text-[10px] font-extrabold text-primary/70 font-mono tracking-tighter uppercase leading-none mb-1">
                                    {book.title.slice(0, 2)}
                                  </span>
                                  <span className="material-symbols-outlined text-muted-foreground/40 text-xs">menu_book</span>
                                </div>
                              )}
                              <div className="absolute bottom-0.5 right-0.5 bg-accent/90 border border-border/10 px-1 rounded text-[7px] font-mono text-primary font-bold shadow-sm">{book.format}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">{book.title}</h3>
                              <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5 mb-2">{book.author}</p>

                              {/* Tags */}
                              {book.genres && book.genres.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {book.genres.slice(0, 2).map((genre) => (
                                    <span key={genre} className="px-1.5 py-0.5 bg-accent text-muted-foreground rounded text-[8px] font-mono uppercase tracking-widest border border-border/40">
                                      {genre}
                                    </span>
                                  ))}
                                  {book.genres.length > 2 && (
                                    <span className="px-1.5 py-0.5 bg-accent/50 text-muted-foreground/70 rounded text-[8px] font-mono uppercase tracking-widest border border-border/20">
                                      +{book.genres.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Prominent Read Book Button */}
                              {book.format !== "PHYSICAL" && (
                                <button
                                  onClick={() => handleReadBook(book.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary font-bold hover:bg-primary hover:text-primary-foreground rounded transition-all shadow-sm"
                                >
                                  <span className="material-symbols-outlined text-xs">chrome_reader_mode</span>
                                  Read Book
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar & Reading Stats */}
                          <div className="mt-auto pt-2 flex flex-col gap-1.5">
                            <div className="flex justify-between items-end text-[10px] font-mono">
                              <span className="text-primary font-bold">{book.progress}%</span>
                              <span className="text-muted-foreground/80 truncate max-w-[120px]">{book.estimatedReadingTime}</span>
                            </div>
                            <div className="w-full h-1 bg-background border border-border/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
                                style={{ width: `${book.progress}%` }}
                              />
                            </div>
                          </div>

                        </div>
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
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={() => setIsAddModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity"
          />
          <div className="w-full max-w-md bg-card border border-border/30 rounded-2xl p-6 shadow-2xl relative z-10 glass-panel overflow-hidden animate-scale-up">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/10 mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">library_add</span>
                <h3 className="font-heading font-bold text-lg">Add Book Manually</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                  placeholder="e.g., Moby Dick"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Author</label>
                <input 
                  type="text" 
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                  placeholder="e.g., Herman Melville"
                />
              </div>



              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Cover Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={newCoverUrl}
                  onChange={(e) => setNewCoverUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                  placeholder="Fiction, Classic, Adventure"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Current Page</label>
                  <input 
                    type="number" 
                    min="0"
                    value={newCurrentPage}
                    onChange={(e) => setNewCurrentPage(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                    placeholder="e.g., 45"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Total Pages</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newTotalPages}
                    onChange={(e) => setNewTotalPages(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                    placeholder="e.g., 300"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs font-mono uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                >
                  Add Volume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT BOOK DIALOG MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={() => setIsEditModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity"
          />
          <div className="w-full max-w-md bg-card border border-border/30 rounded-2xl p-6 shadow-2xl relative z-10 glass-panel overflow-hidden animate-scale-up">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/10 mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit</span>
                <h3 className="font-heading font-bold text-lg">Edit Book Details</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                  placeholder="Title"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Author</label>
                <input 
                  type="text" 
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                  placeholder="Author"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Format</label>
                  <FancyDropdown
                    value={editFormat}
                    onChange={(nextValue) => setEditFormat(nextValue as any)}
                    placeholder="EPUB"
                    ariaLabel="Select book format"
                    className="w-full"
                    triggerClassName="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/50 px-3 text-left text-xs font-mono text-foreground shadow-sm transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    options={formatOptions}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Status</label>
                  <FancyDropdown
                    value={editStatus}
                    onChange={(nextValue) => setEditStatus(nextValue as any)}
                    placeholder="Active"
                    ariaLabel="Select book status"
                    className="w-full"
                    triggerClassName="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/50 px-3 text-left text-xs font-mono text-foreground shadow-sm transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    options={statusOptions}
                  />
                </div>
              </div>

              {editFormat === "PHYSICAL" ? (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Current Page</label>
                    <input 
                      type="number" 
                      min="0"
                      value={editCurrentPage}
                      onChange={(e) => setEditCurrentPage(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                      placeholder="e.g., 45"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Total Pages</label>
                    <input 
                      type="number" 
                      min="1"
                      value={editTotalPages}
                      onChange={(e) => setEditTotalPages(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                      placeholder="e.g., 300"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Progress</label>
                    <span className="text-xs font-mono text-primary font-bold">{editProgress}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={(e) => {
                      const progressVal = Number(e.target.value);
                      setEditProgress(progressVal);
                      
                      if (progressVal === 100) {
                        setEditStatus("completed");
                      } else if (progressVal < 100 && editStatus === "completed") {
                        setEditStatus("active");
                      }
                    }}
                    className="w-full accent-primary h-1 bg-border/40 rounded-lg appearance-none cursor-pointer my-2"
                  />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs font-mono uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PREMIUM BOOK DETAILS MODAL OVERLAY --- */}
      {detailsBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={() => setDetailsBook(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-[6px] transition-opacity duration-300"
          />
          <div className="w-full max-w-2xl bg-card border border-border/30 rounded-2xl shadow-2xl relative z-10 glass-panel overflow-hidden animate-scale-up flex flex-col md:flex-row min-h-[420px] max-h-[90vh]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
            
            {/* Left Column: Large Book Cover / Backdrop Visual */}
            <div className="w-full md:w-1/3 bg-accent/20 border-r border-border/10 flex flex-col items-center justify-center p-6 relative overflow-hidden shrink-0 min-h-[200px] md:min-h-0">
              {/* Blur backdrop reflection for ultra-premium vibe */}
              {detailsBook.coverUrl && (
                <div 
                  className="absolute inset-0 opacity-20 blur-xl scale-125 pointer-events-none"
                  style={{
                    backgroundImage: `url(${detailsBook.coverUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
              )}
              
              <div className="w-28 h-40 bg-gradient-to-br from-primary/10 to-primary/5 border border-border/20 rounded-xl flex items-center justify-center relative shadow-2xl overflow-hidden z-10 shrink-0 transform hover:scale-102 transition-transform duration-300">
                {detailsBook.coverUrl ? (
                  <img src={detailsBook.coverUrl} alt={detailsBook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-accent/30">
                    <span className="text-xl font-extrabold text-primary/70 font-mono tracking-tighter uppercase mb-1">
                      {detailsBook.title.slice(0, 2)}
                    </span>
                    <span className="material-symbols-outlined text-muted-foreground/30 text-2xl">menu_book</span>
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-accent/90 border border-border/10 px-1.5 py-0.5 rounded text-[8px] font-mono text-primary font-bold shadow-md">{detailsBook.format}</div>
              </div>
              
              <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-primary font-bold z-10 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                {detailsBook.format} Volume
              </div>
            </div>

            {/* Right Column: Title, Synopsis and Technical Specifications */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
              
              {/* Close Button */}
              <button 
                onClick={() => setDetailsBook(null)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-all z-20"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="space-y-4">
                {/* Title & Author */}
                <div>
                  <h3 className="font-heading font-extrabold text-xl md:text-2xl text-foreground leading-tight tracking-tight pr-8">{detailsBook.title}</h3>
                  <p className="text-xs md:text-sm text-primary font-mono font-medium mt-1">{detailsBook.author}</p>
                </div>

                {/* Genre badges */}
                {detailsBook.genres && detailsBook.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {detailsBook.genres.slice(0, 4).map((genre, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] font-mono uppercase tracking-wider bg-accent border border-border/30 text-muted-foreground px-2 py-0.5 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis Scroll Box */}
                <div className="pt-2 border-t border-border/10">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">Synopsis</h4>
                  <div className="max-h-[160px] overflow-y-auto pr-2 text-xs md:text-sm text-foreground/80 leading-relaxed font-sans scrollbar-none whitespace-pre-wrap">
                    {detailsBook.description || `No synopsis available for this volume. Open the book to explore its complete visual elements and begin speed calibration.`}
                  </div>
                </div>

                {/* Technical Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/10 text-[10px] font-mono">
                  {detailsBook.publisher && (
                    <div>
                      <span className="block text-muted-foreground uppercase tracking-wider">Publisher</span>
                      <span className="text-foreground font-semibold">{detailsBook.publisher}</span>
                    </div>
                  )}
                  {detailsBook.publishDate && (
                    <div>
                      <span className="block text-muted-foreground uppercase tracking-wider">Published</span>
                      <span className="text-foreground font-semibold">{detailsBook.publishDate}</span>
                    </div>
                  )}
                  {detailsBook.language && (
                    <div>
                      <span className="block text-muted-foreground uppercase tracking-wider">Language</span>
                      <span className="text-foreground font-semibold uppercase">{detailsBook.language}</span>
                    </div>
                  )}
                  <div>
                    <span className="block text-muted-foreground uppercase tracking-wider">Reading Progress</span>
                    <span className="text-primary font-bold">{detailsBook.progress}% ({detailsBook.estimatedReadingTime})</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex gap-3 pt-6 border-t border-border/10 mt-6 shrink-0">
                <button
                  type="button"
                  onClick={() => setDetailsBook(null)}
                  className="flex-1 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleReadBook(detailsBook.id);
                    setDetailsBook(null);
                  }}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs font-mono uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Read Book</span>
                  <span className="material-symbols-outlined text-sm">chrome_reader_mode</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
