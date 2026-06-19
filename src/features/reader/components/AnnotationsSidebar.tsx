"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Annotation } from "@/core/entities/book";
import { X, Search, Filter, Trash2, Calendar, BookOpen, MessageSquare, ChevronRight } from "lucide-react";
import { useReadingStore } from "../stores/reading-store";
import { dbService } from "@/core/services/db-service";
import { toast } from "sonner";

interface AnnotationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToAnnotation: (chapterIndex: number, wordIndex: number) => void;
}

export function AnnotationsSidebar({ isOpen, onClose, onGoToAnnotation }: AnnotationsSidebarProps) {
  const annotations = useReadingStore((state) => state.annotations);
  const setAnnotations = useReadingStore((state) => state.setAnnotations);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterColor, setFilterColor] = React.useState<string | null>(null);

  const filteredAnnotations = React.useMemo(() => {
    return annotations
      .filter((a) => {
        const matchesSearch = a.note?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             a.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesColor = !filterColor || a.color === filterColor;
        return (matchesSearch || searchQuery === "") && matchesColor;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [annotations, searchQuery, filterColor]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await dbService.deleteAnnotation(id);
      setAnnotations(annotations.filter((a) => a.id !== id));
      toast.success("Annotation deleted");
    } catch (error) {
      toast.error("Failed to delete annotation");
    }
  };

  const colors = Array.from(new Set(annotations.map((a) => a.color)));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="annotations-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
          />

          {/* Sidebar */}
          <motion.div
            key="annotations-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-sm bg-card border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Notebook</h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                    {annotations.length} Annotations
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter */}
            <div className="p-4 space-y-3 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search notes or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {colors.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    onClick={() => setFilterColor(null)}
                    className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider transition-all border ${
                      !filterColor ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border/50 hover:border-border"
                    }`}
                  >
                    All
                  </button>
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFilterColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                        filterColor === color ? "border-primary scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {filteredAnnotations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                  <div className="p-4 bg-muted/50 rounded-full">
                    <Filter className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-muted-foreground text-sm">No annotations found matching your filters.</p>
                </div>
              ) : (
                filteredAnnotations.map((annotation) => (
                  <motion.div
                    key={annotation.id}
                    onClick={() => onGoToAnnotation(annotation.chapterIndex, annotation.startWordIndex)}
                    className="group relative p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Color Strip */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1" 
                      style={{ backgroundColor: annotation.color }}
                    />

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(annotation.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, annotation.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-primary/10 rounded-md text-primary shrink-0 mt-0.5">
                          {annotation.style === "highlight" ? (
                            <BookOpen className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-foreground/90 line-clamp-3 italic">
                           &ldquo;{annotation.note || 'Highlighted text...'}&rdquo;
                        </p>
                      </div>

                      {annotation.note && (
                        <div className="flex gap-2 mt-1 pt-2 border-t border-border/30">
                          <MessageSquare className="w-3 h-3 text-primary/60 shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-normal italic">
                            {annotation.note}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">
                          Chapter {annotation.chapterIndex + 1}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
