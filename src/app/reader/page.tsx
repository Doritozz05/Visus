"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { calculateORP, generateRSVPSequence } from "@/core/algorithms/rsvp";
import { generateDynamicClusters } from "@/core/algorithms/clusters";
import { RsvpVisualBox } from "@/features/reader-rsvp/components/RsvpVisualBox";
import { ClusterVisualBox } from "@/features/reader-clusters/components/ClusterVisualBox";
import { ReaderPlayer } from "@/features/reader-controls/components/ReaderPlayer";
import { useSettings } from "@/context/settings-context";
import { useLibrary } from "@/context/library-context";
import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";
import { RsvpSettingsForm } from "@/features/settings/components/RsvpSettingsForm";
import { ClusterSettingsForm } from "@/features/settings/components/ClusterSettingsForm";
import { useRouter } from "next/navigation";

import { paginateChapter } from "@/lib/parser/paginator";
import { parseEpub } from "@/lib/parser/epub";
import { parsePdf } from "@/lib/parser/pdf";
import { parseTxt } from "@/lib/parser/txt";

// Imported modular subcomponents
import { EmptyLibraryState } from "@/features/reader/components/EmptyLibraryState";
import { BookshelfSelector } from "@/features/reader/components/BookshelfSelector";
import { ReaderHeader } from "@/features/reader/components/ReaderHeader";
import { PagesVisualBox } from "@/features/reader/components/PagesVisualBox";

export default function ReaderPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { books, activeBookId, setActiveBookId, addBook, updateBook } = useLibrary();

  // Active book derivation
  const activeBook = React.useMemo(() => {
    if (!activeBookId) return null;
    return books.find((b) => b.id === activeBookId) || null;
  }, [books, activeBookId]);

  // Player session states
  const [activeChapterIndex, setActiveChapterIndex] = React.useState(0);
  const [wordIndex, setWordIndex] = React.useState(0); // relative to active chapter
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [wpm, setWpm] = React.useState(600);
  const [mode, setMode] = React.useState<"rsvp" | "cluster" | "normal">("normal");
  const [completedChapter, setCompletedChapter] = React.useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState<"general" | "rsvp" | "cluster">("rsvp");
  const [isTocOpen, setIsTocOpen] = React.useState(false);

  // Ingestion File input reference
  const localFileInputRef = React.useRef<HTMLInputElement>(null);
  const initializedBookIdRef = React.useRef<string | null>(null);

  // Dynamic parser turning any plain text content or structural parsed chapters into visual chapters/pages
  const chaptersData = React.useMemo(() => {
    if (!activeBook) return [];
    
    // Use pre-parsed chapters if available on the book object, otherwise segment content as fallback
    let rawChapters = activeBook.chapters || [];
    
    if (rawChapters.length === 0 && activeBook.content) {
      // Split content by double newlines or paragraph breaks as fallback
      const paragraphs = activeBook.content.split(/\n\s*\n+/).filter(p => p.trim() !== "");
      const legacyChapters = [];
      for (let i = 0; i < paragraphs.length; i += 6) {
        const title = `Section ${Math.floor(i / 6) + 1}`;
        const content = paragraphs.slice(i, i + 6).join("\n\n");
        legacyChapters.push({ title, content });
      }
      rawChapters = legacyChapters;
    }

    if (rawChapters.length === 0) {
      rawChapters = [{
        title: "Section 1",
        content: activeBook.content || "Empty book content."
      }];
    }

    return rawChapters.map((ch, idx) => {
      const rsvpSeq = generateRSVPSequence(ch.content);
      const clusterSeq = generateDynamicClusters(ch.content, 3);
      const wordsArr = ch.content.split(/\s+/).filter(w => w.trim() !== "");
      
      return {
        ...ch,
        index: idx,
        words: wordsArr,
        rsvpSequence: rsvpSeq,
        clusterChunks: clusterSeq,
      };
    });
  }, [activeBook]);

  // Derived properties from active chapter index
  const currentChapter = React.useMemo(() => {
    if (chaptersData.length === 0) {
      return { title: "No Book Loaded", content: "", words: [], rsvpSequence: [], clusterChunks: [], index: 0 };
    }
    const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
    return chaptersData[safeIdx];
  }, [chaptersData, activeChapterIndex]);

  const words = React.useMemo(() => {
    return currentChapter?.words || [];
  }, [currentChapter]);

  const rsvpSequence = React.useMemo(() => {
    return currentChapter?.rsvpSequence || [];
  }, [currentChapter]);

  const clusterChunks = React.useMemo(() => {
    return currentChapter?.clusterChunks || [];
  }, [currentChapter]);

  // Font-adaptive visual words-per-page scaler to prevent any visual overflows/cuts
  const getSafeWordsPerPage = React.useCallback((fontSize: number, baseWords: number): number => {
    const scale = 16 / fontSize;
    // Apply a safety scaling factor (0.82) to guarantee text fits comfortably inside the 660px container under any font size
    return Math.max(100, Math.round(baseWords * scale * 0.82));
  }, []);

  const wordsPerPage = React.useMemo(() => {
    const baseWords = settings.general.readerWordsPerPage || 300;
    const fontSize = settings.general.readerFontSize || 16;
    return getSafeWordsPerPage(fontSize, baseWords);
  }, [settings.general.readerWordsPerPage, settings.general.readerFontSize, getSafeWordsPerPage]);

  const allBookPages = React.useMemo(() => {
    if (chaptersData.length === 0) return [];
    
    let absolutePageIndex = 0;
    return chaptersData.flatMap((ch, chIdx) => {
      const chPages = paginateChapter(ch.content, wordsPerPage);
      return chPages.map((page) => {
        const absPageIdx = absolutePageIndex++;
        return {
          ...page,
          chapterIndex: chIdx,
          absolutePageIndex: absPageIdx,
        };
      });
    });
  }, [chaptersData, wordsPerPage]);

  const activePage = React.useMemo(() => {
    if (allBookPages.length === 0) return null;
    const found = allBookPages.find(
      (p) => p.chapterIndex === activeChapterIndex && wordIndex >= p.startWordIndex && wordIndex < p.endWordIndex
    );
    return found || allBookPages.find(p => p.chapterIndex === activeChapterIndex) || allBookPages[0];
  }, [allBookPages, activeChapterIndex, wordIndex]);

  // Sync back visual progress to the active library book
  React.useEffect(() => {
    if (!activeBook || chaptersData.length === 0 || words.length === 0) return;
    
    // Smooth progress representation across chapters
    const progressInChapter = wordIndex / words.length;
    const currentProgress = Math.min(
      100,
      Math.round(((activeChapterIndex + progressInChapter) / chaptersData.length) * 100)
    );
    
    // Atomic state update: avoid infinite loop checks
    if (Math.abs(activeBook.progress - currentProgress) > 2) {
      updateBook(activeBook.id, { progress: currentProgress });
    }
  }, [wordIndex, activeChapterIndex, chaptersData.length, words.length, activeBook, updateBook]);

  // Reset player indexes when active book changes, resuming from last saved progress
  React.useEffect(() => {
    if (!activeBook || chaptersData.length === 0) {
      setWordIndex(0);
      setActiveChapterIndex(0);
      setIsPlaying(false);
      setCompletedChapter(null);
      initializedBookIdRef.current = null;
      return;
    }
    
    if (initializedBookIdRef.current !== activeBook.id) {
      initializedBookIdRef.current = activeBook.id;
      const targetChapterIdx = Math.min(
        chaptersData.length - 1,
        Math.max(0, Math.floor((activeBook.progress / 100) * chaptersData.length))
      );
      
      setActiveChapterIndex(targetChapterIdx);
      setWordIndex(0);
      setIsPlaying(false);
      setCompletedChapter(null);
    }
  }, [activeBook, chaptersData.length]);

  // Map individual word index to correct dynamic semantic foveal cluster chunk
  const activeClusterIndex = React.useMemo(() => {
    let currentWordOffset = 0;
    for (let i = 0; i < clusterChunks.length; i++) {
      const chunkWordsCount = clusterChunks[i].wordCount;
      if (wordIndex >= currentWordOffset && wordIndex < currentWordOffset + chunkWordsCount) {
        return i;
      }
      currentWordOffset += chunkWordsCount;
    }
    return Math.max(0, clusterChunks.length - 1);
  }, [clusterChunks, wordIndex]);

  // Master speed reading playback timer loop (chapter-scoped)
  React.useEffect(() => {
    if (!isPlaying || rsvpSequence.length === 0) return;

    const baseDelayMs = (60 * 1000) / wpm;
    let finalDelay = baseDelayMs;
    let wordsToAdvance = 1;

    if (mode === "rsvp") {
      const currentWordObj = rsvpSequence[wordIndex];
      const delayMultiplier = currentWordObj ? currentWordObj.delayMultiplier : 1.0;
      finalDelay = baseDelayMs * delayMultiplier;
      wordsToAdvance = 1;
    } else if (mode === "cluster") {
      const currentChunk = clusterChunks[activeClusterIndex];
      if (currentChunk) {
        const delayMultiplier = currentChunk.delayMultiplier || 1.0;
        finalDelay = baseDelayMs * currentChunk.wordCount * delayMultiplier;
        wordsToAdvance = currentChunk.wordCount;
      }
    } else {
      setIsPlaying(false);
      return;
    }

    const interval = setTimeout(() => {
      setWordIndex((prev) => {
        const nextIndex = prev + wordsToAdvance;

        if (nextIndex >= rsvpSequence.length) {
          setIsPlaying(false);
          setCompletedChapter(currentChapter.title);
          return Math.min(nextIndex, rsvpSequence.length - 1);
        }
        return nextIndex;
      });
    }, finalDelay);

    return () => clearTimeout(interval);
  }, [isPlaying, wordIndex, wpm, rsvpSequence, mode, clusterChunks, activeClusterIndex, currentChapter]);

  const handlePageChange = (direction: "prev" | "next") => {
    if (allBookPages.length === 0 || !activePage) return;
    
    if (direction === "prev") {
      if (activePage.absolutePageIndex > 0) {
        const prevPageObj = allBookPages[activePage.absolutePageIndex - 1];
        setActiveChapterIndex(prevPageObj.chapterIndex);
        setWordIndex(prevPageObj.startWordIndex);
      }
    } else {
      if (activePage.absolutePageIndex < allBookPages.length - 1) {
        const nextPageObj = allBookPages[activePage.absolutePageIndex + 1];
        setActiveChapterIndex(nextPageObj.chapterIndex);
        setWordIndex(nextPageObj.startWordIndex);
      }
    }
  };

  const openQuickSettings = () => {
    setIsPlaying(false);
    if (mode === "normal") {
      setDrawerTab("general");
    } else {
      setDrawerTab(mode);
    }
    setIsDrawerOpen(true);
  };

  // Parse a file name helper
  const parseFileName = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf(".");
    const cleanName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1).toUpperCase() : "TXT";
    const validFormat = (extension === "PDF" || extension === "EPUB" || extension === "TXT") ? (extension as "PDF" | "EPUB" | "TXT") : "TXT";
    let title = cleanName;
    let author = "Unknown Author";
    if (cleanName.includes(" - ")) {
      const parts = cleanName.split(" - ");
      title = parts[0].trim();
      author = parts[1].trim();
    }
    return { title, author, format: validFormat };
  };

  // Direct ingestion upload from within the Reading Room
  const handleLocalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const { title, author, format } = parseFileName(file.name);
    
    if (format === "TXT") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        const parsedChapters = parseTxt(textContent);
        const newId = addBook(title, author, format, textContent, parsedChapters);
        setActiveBookId(newId);
      };
      reader.readAsText(file);
    } else if (format === "PDF") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const parsed = await parsePdf(arrayBuffer);
          const finalTitle = parsed.title && parsed.title !== "Unknown PDF" ? parsed.title : title;
          const finalAuthor = parsed.author && parsed.author !== "Unknown Author" ? parsed.author : author;
          const fullContent = parsed.chapters.map(c => c.content).join("\n\n");
          const newId = addBook(finalTitle, finalAuthor, format, fullContent, parsed.chapters);
          setActiveBookId(newId);
        } catch (pdfErr) {
          console.error("Local PDF Parsing failed:", pdfErr);
          const newId = addBook(title, author, format);
          setActiveBookId(newId);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (format === "EPUB") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const parsed = await parseEpub(arrayBuffer);
          const finalTitle = parsed.title && parsed.title !== "Unknown Title" ? parsed.title : title;
          const finalAuthor = parsed.author && parsed.author !== "Unknown Author" ? parsed.author : author;
          const fullContent = parsed.chapters.map(c => c.content).join("\n\n");
          const newId = addBook(finalTitle, finalAuthor, format, fullContent, parsed.chapters);
          setActiveBookId(newId);
        } catch (epubErr) {
          console.error("Local EPUB Parsing failed:", epubErr);
          const newId = addBook(title, author, format);
          setActiveBookId(newId);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const newId = addBook(title, author, format);
      setActiveBookId(newId);
    }
  };

  const triggerLocalFileBrowser = () => {
    if (localFileInputRef.current) localFileInputRef.current.value = "";
    localFileInputRef.current?.click();
  };

  // Calculations for current active RSVP word
  const currentWordObj = rsvpSequence[wordIndex] || { text: "Ready", orpIndex: 1, delayMultiplier: 1.0 };
  const currentWordText = currentWordObj.text;
  const orpIndex = currentWordObj.orpIndex;
  const leftPart = currentWordText.slice(0, orpIndex);
  const focusLetter = currentWordText.charAt(orpIndex);
  const rightPart = currentWordText.slice(orpIndex + 1);

  const progressPercentage = words.length > 0 
    ? Math.round((Math.min(wordIndex + 1, words.length) / words.length) * 100) 
    : 0;

  const readerFontClass = React.useMemo(() => {
    const ff = settings.general.readerFontFamily || "serif";
    switch (ff) {
      case "inter":
        return "font-sans antialiased text-justify";
      case "atkinson":
        return "font-sans antialiased text-justify tracking-wide font-medium";
      case "dyslexic":
        return "font-sans antialiased text-justify tracking-wide font-normal";
      case "serif":
      default:
        return "font-serif antialiased text-justify tracking-normal text-foreground/90";
    }
  }, [settings.general.readerFontFamily]);

  // --- RENDERING STATE 1: COMPLETELY EMPTY LIBRARY ---
  if (books.length === 0) {
    return (
      <EmptyLibraryState
        localFileInputRef={localFileInputRef}
        handleLocalFileChange={handleLocalFileChange}
        triggerLocalFileBrowser={triggerLocalFileBrowser}
      />
    );
  }

  // --- RENDERING STATE 2: BOOKSHELF CHOOSE LIST ---
  if (!activeBook) {
    return (
      <BookshelfSelector
        books={books}
        setActiveBookId={setActiveBookId}
      />
    );
  }

  // --- RENDERING STATE 3: SPEED READING ENGINE WORKSPACE ---
  return (
    <div className="bg-background text-foreground font-sans h-screen overflow-hidden overscroll-none flex flex-col md:flex-row antialiased transition-all duration-300 relative">
      <Sidebar activePath="/reader" />

      {/* Mobile TopNav */}
      <nav className="md:hidden bg-card border-b border-border/50 flex justify-between items-center w-full px-6 py-4 z-40 sticky top-0 transition-all duration-300">
        <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openQuickSettings}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center border border-border/30 hover:text-primary transition-all text-muted-foreground"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-accent border border-border/30 overflow-hidden">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              VP
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Workspace (z-10 ensures dropdown floats cleanly above it when header is z-30) */}
      <main className="flex-1 flex flex-col items-center justify-between relative md:pl-64 h-[calc(100vh-80px)] md:h-screen p-6 pt-32 pb-8 overflow-hidden overscroll-none">

        {/* Modular Header Component */}
        <ReaderHeader
          activeBook={activeBook}
          currentChapter={currentChapter}
          activeChapterIndex={activeChapterIndex}
          setActiveChapterIndex={setActiveChapterIndex}
          chaptersData={chaptersData}
          setWordIndex={setWordIndex}
          progressPercentage={progressPercentage}
          mode={mode}
          setMode={setMode}
          setIsPlaying={setIsPlaying}
          setCompletedChapter={setCompletedChapter}
          openQuickSettings={openQuickSettings}
          setActiveBookId={setActiveBookId}
          isTocOpen={isTocOpen}
          setIsTocOpen={setIsTocOpen}
        />

        {/* Reading Canvas Container */}
        <div className={`w-full ${
          mode === "cluster" 
            ? "max-w-4xl" 
            : mode === "normal" 
              ? "max-w-5xl" 
              : "max-w-2xl"
        } px-6 md:px-0 flex-1 flex flex-col items-center justify-center relative z-10 transition-all duration-500`}>

          {/* Auto-pause Chapter completed overlay */}
          {completedChapter && (
            <div className="absolute inset-0 bg-background/85 dark:bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 rounded-2xl border border-border/20 transition-all duration-300">
              <div className="max-w-md w-full bg-card border border-border/30 rounded-2xl p-8 text-center shadow-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center gap-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-bounce relative z-10">
                  <span className="material-symbols-outlined text-3xl">auto_stories</span>
                </div>
                
                <div className="relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2 block font-bold">Section Completed</span>
                  <h2 className="text-xl font-bold font-heading text-foreground mb-3">{completedChapter}</h2>
                  <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto">
                    Excellent comprehension pace! Your mind has successfully processed this chapter. Take a second to breathe and consolidate the information.
                  </p>
                </div>

                <div className="flex gap-3 w-full mt-2 relative z-10">
                  <button
                    onClick={() => {
                      setCompletedChapter(null);
                      setMode("normal");
                    }}
                    className="flex-1 px-4 py-2.5 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  >
                    Back to Pages
                  </button>
                  <button
                    onClick={() => {
                      setCompletedChapter(null);
                      setIsPlaying(true);
                    }}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Next Chapter</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "normal" ? (
            <PagesVisualBox
              currentChapter={currentChapter}
              activePage={activePage}
              allBookPages={allBookPages}
              readerFontClass={readerFontClass}
              fontSize={settings.general.readerFontSize || 16}
              handlePageChange={handlePageChange}
            />
          ) : mode === "rsvp" ? (
            <RsvpVisualBox
              leftPart={leftPart}
              focusLetter={focusLetter}
              rightPart={rightPart}
              settings={settings.rsvp}
            />
          ) : (
            <ClusterVisualBox
              clusterChunks={clusterChunks}
              activeClusterIndex={activeClusterIndex}
              settings={settings.cluster}
            />
          )}
        </div>

        {/* Player Bar (Hidden in standard page mode) */}
        {mode !== "normal" && (
          <ReaderPlayer
            isPlaying={isPlaying}
            onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
            wpm={wpm}
            onWpmChange={setWpm}
            onRewind={() => setWordIndex((prev) => Math.max(0, prev - 10))}
            onSkip={() => setWordIndex((prev) => Math.min(words.length - 1, prev + 10))}
            mode={mode}
            onPrevPage={() => handlePageChange("prev")}
            onNextPage={() => handlePageChange("next")}
            hasPrevPage={activePage ? activePage.absolutePageIndex > 0 : false}
            hasNextPage={activePage ? activePage.absolutePageIndex < allBookPages.length - 1 : false}
          />
        )}
      </main>

      {/* QUICK SETTINGS DRAWER OVERLAY */}
      {isDrawerOpen && (
        <>
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] transition-opacity duration-300"
          />

          <div className="fixed right-0 top-0 bottom-0 z-[100] w-full sm:w-[400px] bg-card border-l border-border/40 shadow-2xl glass-panel p-6 flex flex-col transition-all duration-300 animate-slide-in">
            
            <div className="flex items-center justify-between pb-4 border-b border-border/30 mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">settings_applications</span>
                <h3 className="font-heading font-bold text-base">Quick Calibration</h3>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-all"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex gap-1 border-b border-border/10 pb-3 mb-6 overflow-x-auto scrollbar-none">
              {[
                { id: "general", label: "General", icon: "settings" },
                { id: "rsvp", label: "RSVP", icon: "bolt" },
                { id: "cluster", label: "Cluster", icon: "splitscreen" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDrawerTab(t.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-all shrink-0 ${
                    drawerTab === t.id
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border/30 bg-card hover:bg-accent/65 text-muted-foreground hover:text-foreground shadow-sm"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            <div 
              className="flex-1 overflow-y-auto scrollbar-none py-2 -my-2"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 24px), transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 24px), transparent 100%)",
              }}
            >
              <div className="pt-2 pb-12">
                {drawerTab === "general" && <GeneralSettingsForm />}
                {drawerTab === "rsvp" && <RsvpSettingsForm />}
                {drawerTab === "cluster" && <ClusterSettingsForm />}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
