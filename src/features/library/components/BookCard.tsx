"use client";

import * as React from "react";
import Image from "next/image";
import { Book, Trash2, MoreVertical, Info, BookOpen, CheckCircle, Pencil, Cloud, CloudOff, RefreshCw, ListPlus } from "lucide-react";
import { Book as BookEntity } from "@/core/entities/book";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useContextMenu, ContextMenuItem } from "@/components/ui/ContextMenu";
import { AddToListDialog } from "./AddToListDialog";

interface BookCardProps {
  book: BookEntity;
  activeDropdownId: string | null;
  setActiveDropdownId: (id: string | null) => void;
  onDelete: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onEdit: (book: BookEntity) => void;
  onUpdateBook: (id: string, updates: Partial<BookEntity>) => void;
  onRead: (id: string) => void;
  onDetails: (book: BookEntity) => void;
  onToggleCloudSync?: (id: string) => void;
  isSyncing?: boolean;
}

export function BookCard({
  book,
  activeDropdownId,
  setActiveDropdownId,
  onDelete,
  onToggleCompleted,
  onEdit,
  onUpdateBook,
  onRead,
  onDetails,
  onToggleCloudSync,
  isSyncing = false,
}: BookCardProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showAddToList, setShowAddToList] = React.useState(false);
  const { showMenu } = useContextMenu();
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeDropdownId !== book.id) return;
    
    if (e.key === "Escape") {
      setActiveDropdownId(null);
      return;
    }
    
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || []) as HTMLElement[];
      const activeElement = document.activeElement as HTMLElement;
      const currentIndex = items.indexOf(activeElement);
      
      let nextIndex = 0;
      if (e.key === "ArrowDown") {
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      }
      items[nextIndex]?.focus();
    }
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const items: ContextMenuItem[] = [
          ...(book.format !== "PHYSICAL" ? [{
            id: "read",
            label: "Read book",
            icon: <BookOpen className="w-4 h-4" />,
            onClick: () => onRead(book.id),
          }] : []),
          {
            id: "details",
            label: "View details",
            icon: <Info className="w-4 h-4" />,
            onClick: () => onDetails(book),
          },
          {
            id: "add-to-list",
            label: "Add to list",
            icon: <ListPlus className="w-4 h-4" />,
            onClick: () => setShowAddToList(true),
          },
          {
            id: "toggle-completed",
            label: book.status === "completed" ? "Mark as active" : "Mark as completed",
            icon: book.status === "completed" ? <BookOpen className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />,
            onClick: () => onToggleCompleted(book.id),
          },
          {
            id: "edit",
            label: "Edit details",
            icon: <Pencil className="w-4 h-4" />,
            onClick: () => onEdit(book),
          },
          ...(book.format !== "PHYSICAL" && onToggleCloudSync ? [{
            id: "cloud-sync",
            label: book.isInCloud ? "Remove from cloud" : "Sync to cloud",
            icon: book.isInCloud ? <CloudOff className="w-4 h-4" /> : <Cloud className="w-4 h-4" />,
            onClick: () => onToggleCloudSync(book.id),
            disabled: isSyncing,
          }] : []),
          { id: "divider-delete", label: "", divider: true },
          {
            id: "delete",
            label: "Delete book",
            icon: <Trash2 className="w-4 h-4" />,
            tone: "danger",
            onClick: () => setShowDeleteConfirm(true),
          }
        ];

        showMenu(e, items);
      }}
      className="bg-card border border-border/20 rounded-xl p-5 flex flex-col relative hover:border-primary/50 transition-all shadow-md liquid-glass h-[235px]"
    >
      {/* Option Actions Row */}
      <div className="absolute top-4 right-4 flex flex-col items-center gap-2 z-20">
        {/* Direct Trash Icon Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="w-7 h-7 rounded-full hover:bg-rose-500/10 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-all animate-fade-in"
          title="Delete book"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Options Dropdown Trigger */}
        <div className="relative" onKeyDown={handleKeyDown}>
          <button
            aria-haspopup="true"
            aria-expanded={activeDropdownId === book.id}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdownId(activeDropdownId === book.id ? null : book.id);
            }}
            className="w-7 h-7 rounded-full hover:bg-accent/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {activeDropdownId === book.id && (
            <div
              ref={menuRef}
              role="menu"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-30 w-52 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-[0_24px_70px_rgba(0,0,0,0.22)] animate-fade-in opacity-100"
            >
              <button
                role="menuitem"
                onClick={() => {
                  onDetails(book);
                  setActiveDropdownId(null);
                }}
                className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-accent/80 flex items-center gap-2.5 hover:text-primary transition-colors border-b border-border/10 focus:outline-none focus:bg-accent/80"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                View details
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  onToggleCompleted(book.id);
                  setActiveDropdownId(null);
                }}
                className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-accent/80 flex items-center gap-2.5 hover:text-primary transition-colors focus:outline-none focus:bg-accent/80"
              >
                {book.status === "completed" ? (
                  <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                {book.status === "completed" ? "Mark as active" : "Mark as completed"}
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  onEdit(book);
                  setActiveDropdownId(null);
                }}
                className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-accent/80 flex items-center gap-2.5 hover:text-primary transition-colors border-b border-border/10 focus:outline-none focus:bg-accent/80"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                Edit details
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setShowAddToList(true);
                  setActiveDropdownId(null);
                }}
                className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-accent/80 flex items-center gap-2.5 hover:text-primary transition-colors focus:outline-none focus:bg-accent/80"
              >
                <ListPlus className="w-3.5 h-3.5 text-muted-foreground" />
                Add to list
              </button>
            </div>
          )}
        </div>

                {/* Cloud Sync Toggle */}
        {book.format !== "PHYSICAL" && onToggleCloudSync && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCloudSync(book.id);
            }}
            disabled={isSyncing}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              book.isInCloud 
                ? "text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20" 
                : "text-muted-foreground/30 hover:bg-accent hover:text-foreground border border-transparent"
            }`}
            title={book.isInCloud ? "Remove from cloud" : "Sync to cloud (3 slots max)"}
          >
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : book.isInCloud ? (
              <Cloud className="w-3.5 h-3.5" />
            ) : (
              <CloudOff className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="flex gap-4 items-start pr-12 mb-3">
          <button 
            className="w-12 h-16 bg-gradient-to-br from-primary/10 to-primary/5 border border-border/30 rounded-lg flex items-center justify-center shrink-0 relative shadow-inner overflow-hidden cursor-pointer p-0" 
            onClick={() => onDetails(book)}
            aria-label={`View details for ${book.title}`}
          >
            {book.coverUrl ? (
              <Image src={book.coverUrl} fill alt={book.title} className="object-cover transition-transform duration-300 hover:scale-105" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-accent/30">
                <span className="text-[10px] font-extrabold text-primary/70 font-mono tracking-tighter uppercase leading-none mb-1">
                  {book.title.slice(0, 2)}
                </span>
                <Book className="w-4 h-4 text-muted-foreground/40" />
              </div>
            )}
            <div className="absolute bottom-0.5 right-0.5 bg-accent/90 border border-border/10 px-1.5 py-0.5 rounded text-[7px] font-mono text-primary font-bold shadow-sm">{book.format}</div>
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">{book.title}</h3>
            <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5 mb-2">{book.author}</p>

            {/* Tags */}
            {book.genres && book.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
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
          </div>
        </div>
      </div>

      {/* Footer Area: Fixed Position Actions & Progress */}
      <div className="mt-auto pt-4 border-t border-border/5 flex flex-col items-center gap-3">
        {book.format !== "PHYSICAL" && (
          <button
            onClick={() => onRead(book.id)}
            className="w-fit px-6 py-2 bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary font-bold hover:bg-primary hover:text-primary-foreground rounded-lg transition-all shadow-sm group/btn flex items-center gap-1.5"
            title="Read book"
          >
            <BookOpen className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
            <span>Read book</span>
          </button>
        )}

        <div className="w-full">
          <div className="flex justify-between items-end text-[10px] font-mono mb-1.5">
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(book.id);
          toast.success(`"${book.title}" deleted.`);
        }}
        title="Delete volume?"
        description={`This will permanently remove "${book.title}" and its reading progress from your local library.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Add to List Dialog */}
      <AddToListDialog
        book={book}
        isOpen={showAddToList}
        onClose={() => setShowAddToList(false)}
      />
    </div>
  );
}
