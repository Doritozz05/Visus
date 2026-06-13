"use client";

import * as React from "react";
import { FancyDropdown } from "@/components/ui/FancyDropdown";
import { useLibrary } from "@/features/library/context/library-context";
import { useSettings } from "@/features/settings/context/settings-context";
import { Book } from "@/core/entities/book";
import { useRouter } from "next/navigation";
import { Eraser, Search, Plus, Library, Flame, Pencil, BookOpen, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatsService } from "@/core/services/stats-service";
import { useAuth } from "@/features/auth/context/auth-context";
import { toast } from "sonner";

// Extracted Sub-Components
import { IngestionDropzone } from "@/features/library/components/IngestionDropzone";
import { AddBookModal } from "@/features/library/components/AddBookModal";
import { EditBookModal } from "@/features/library/components/EditBookModal";
import { BookDetailsModal } from "@/features/library/components/BookDetailsModal";
import { BookCard } from "@/features/library/components/BookCard";

// Extracted Hooks
import { useBookIngestion } from "@/features/library/hooks/useBookIngestion";
import { useAddBookForm } from "@/features/library/hooks/useAddBookForm";
import { useEditBookForm } from "@/features/library/hooks/useEditBookForm";
import { useCloudSync } from "@/features/library/hooks/useCloudSync";

export default function LibraryDashboard() {
  const { books, addBook, updateBook, deleteBook, toggleCompleted, resetLibrary, setActiveBookId, isHydrated } = useLibrary();
  const router = useRouter();
  const { user } = useAuth();
  const { settings, updateGeneralSettings } = useSettings();
  const { yearlyReadingGoal } = settings.general;

  const [summary, setSummary] = React.useState({
    currentStreakDays: 0,
  });

  const userInitial = user?.email?.charAt(0).toUpperCase() || "V";

  const [isEditingGoal, setIsEditingGoal] = React.useState(false);
  const [tempGoal, setTempGoal] = React.useState(yearlyReadingGoal);

  React.useEffect(() => {
    setTempGoal(yearlyReadingGoal);
  }, [yearlyReadingGoal]);

  React.useEffect(() => {
    const fetchStats = async () => {
      const completedBooksCount = books.filter((b) => b.status === "completed").length;
      const statsSummary = await StatsService.getStatsSummary(completedBooksCount);
      setSummary({ currentStreakDays: statsSummary.currentStreakDays });
    };
    if (isHydrated) fetchStats();
  }, [books, isHydrated]);

  // State controls for UI
  const [activeSyncingId, setActiveSyncingId] = React.useState<string | null>(null);

  const {
    syncToCloud,
    removeFromCloud,
    isSyncing,
    error: syncError,
    cloudSlotsUsed,
    maxSlots
  } = useCloudSync(books, updateBook);

  const handleToggleCloudSync = async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    setActiveSyncingId(id);
    if (book.isInCloud) {
      await removeFromCloud(id);
    } else {
      await syncToCloud(id);
    }
    setActiveSyncingId(null);
  };

  // Show sync error alert if any
  React.useEffect(() => {
    if (syncError) {
      toast.error(syncError);
    }
  }, [syncError]);

  // State controls for UI
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"active" | "completed" | "archived">("active");
  const [activeGenre, setActiveGenre] = React.useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = React.useState<string | null>(null);
  const [detailsBook, setDetailsBook] = React.useState<Book | null>(null);

  // Use custom hooks
  const {
    isDragOver,
    isIngesting,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    triggerFileBrowser
  } = useBookIngestion(addBook);

  const {
    isAddModalOpen,
    setIsAddModalOpen,
    newTitle,
    setNewTitle,
    newAuthor,
    setNewAuthor,
    newCoverUrl,
    setNewCoverUrl,
    newTags,
    setNewTags,
    newCurrentPage,
    setNewCurrentPage,
    newTotalPages,
    setNewTotalPages,
    handleAddSubmit
  } = useAddBookForm(addBook);

  const {
    isEditModalOpen,
    setIsEditModalOpen,
    editTitle,
    setEditTitle,
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
    handleEditSubmit,
    openEditModal
  } = useEditBookForm(updateBook);

  // Close dropdowns on click outside
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleReadBook = (bookId: string) => {
    setActiveBookId(bookId);
    router.push("/reader");
  };

  const handleUpdateGoal = () => {
    updateGeneralSettings({ yearlyReadingGoal: tempGoal });
    setIsEditingGoal(false);
    toast.success("Yearly reading goal updated.");
  };

  // Stats computation
  const completedBooksCount = React.useMemo(() => {
    return books.filter((b) => b.status === "completed").length;
  }, [books]);

  const goalProgressPercentage = Math.min(Math.round((completedBooksCount / yearlyReadingGoal) * 100), 100);

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
    return <LoadingSpinner className="h-full" />;
  }

  return (
    <>
      {/* Hidden file input for browsing */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.epub,.txt" 
        multiple
        className="hidden" 
      />

      <div className="p-6 md:p-10 flex-1 max-w-5xl mx-auto w-full h-[calc(100vh-64px)] md:h-screen overflow-hidden flex flex-col">
        <header className="border-b border-border/20 pb-4 mb-6 flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary">Digital assets</h2>
              <div className="h-3 w-px bg-border/40"></div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{books.length} Objects indexed</span>
            </div>
            <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">Library &amp; archives</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard"
              className="flex items-center gap-4 bg-accent/30 px-4 py-1.5 rounded-xl border border-border/10 shadow-sm backdrop-blur-sm hover:bg-accent/50 hover:border-primary/30 transition-all group/header"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Flame className="text-primary w-4 h-4 animate-pulse" />
                <span className="font-bold text-foreground text-[11px] group-hover/header:text-primary transition-colors">{summary.currentStreakDays} day streak</span>
              </div>
              <div className="h-4 w-px bg-border/30"></div>
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-lg ring-2 ring-background overflow-hidden group-hover/header:ring-primary/50 transition-all">
                {user?.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.name || "User"} width={28} height={28} className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              <ChevronRight className="w-3 h-3 text-muted-foreground group-hover/header:text-primary transition-all group-hover/header:translate-x-0.5" />
            </Link>
          </div>
        </header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden pb-4">
            
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

              {/* Combined Info Panel (Compact) */}
              <div className="flex flex-col gap-4">
                {/* Cloud Storage Slots */}
                <div className="bg-card rounded-xl border border-border/20 p-4 shadow-lg glass-panel relative overflow-hidden group shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                  <div className="flex justify-between items-center mb-2 relative z-10">
                    <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Cloud Storage</h2>
                    <span className="text-[10px] font-mono text-primary font-bold">{cloudSlotsUsed} / {maxSlots}</span>
                  </div>
                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden relative z-10 border border-border/10">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${(cloudSlotsUsed / maxSlots) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dynamic Reading Stats (Compact) */}
                <div className="bg-card rounded-xl border border-border/20 p-4 shadow-lg glass-panel relative overflow-hidden group shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                  <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none">
                    <BookOpen className="w-16 h-16 text-foreground" />
                  </div>
                  <div className="flex justify-between items-center mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Books Read</h2>
                      <button 
                        onClick={() => setIsEditingGoal(!isEditingGoal)}
                        className="p-1 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-primary"
                        title="Edit yearly goal"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                  
                  {isEditingGoal ? (
                    <div className="flex items-center gap-2 mb-2 relative z-10 animate-in fade-in slide-in-from-top-1 duration-200">
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={tempGoal}
                        onChange={(e) => setTempGoal(parseInt(e.target.value) || 1)}
                        className="w-16 bg-background border border-border/50 rounded px-1.5 py-0.5 text-lg font-bold font-heading focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateGoal()}
                      />
                      <button 
                        onClick={handleUpdateGoal}
                        className="bg-primary text-primary-foreground px-2 py-1 rounded text-[9px] font-mono font-bold hover:brightness-110 transition-all"
                      >
                        SAVE
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 mb-2 relative z-10">
                      <span className="text-2xl font-extrabold font-heading text-foreground">{completedBooksCount}</span>
                      <span className="text-xs text-muted-foreground/80 font-normal">/ {yearlyReadingGoal}</span>
                    </div>
                  )}

                  <div className="relative z-10 mt-auto">
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border/10">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500 group-hover:brightness-110" 
                        style={{ width: `${goalProgressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Search, Filters & Book List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Search, Filter Tabs & Add Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-card rounded-xl border border-border/20 p-2 shadow-xl glass-panel">
                <div className="flex-1 flex items-center px-4 gap-2 w-full">
                  <Search className="text-muted-foreground w-4 h-4" />
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
                    <Plus className="w-5 h-5" />
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
              <div className="relative flex-1 min-h-[380px] max-h-[58vh]">
                <div className="max-h-[58vh] overflow-y-auto scrollbar-none scroll-fade-bottom pr-1 pb-48">
                  {filteredBooks.length === 0 ? (
                    <div className="border border-dashed border-border/40 rounded-xl flex flex-col items-center justify-center p-12 text-center bg-card/10 h-full min-h-[300px]">
                      <Library className="w-10 h-10 text-muted-foreground/60 mb-3" />
                      <p className="text-sm font-semibold text-muted-foreground">No books found</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs leading-relaxed">
                        Try adjusting your search criteria, switching tabs, or uploading a new file in the ingestion area.
                      </p>
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
                          onToggleCloudSync={handleToggleCloudSync}
                          isSyncing={activeSyncingId === book.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

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

    </>
  );
}
