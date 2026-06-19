"use client";

import * as React from "react";
import { MessageSquare, X, Save, Trash2, Tag as TagIcon } from "lucide-react";
import { Annotation } from "@/core/entities/book";
import { Dialog } from "@/components/ui/Dialog";
import { IconButton } from "@/components/ui/IconButton";

interface AnnotationNoteDialogProps {
  annotation: Partial<Annotation>;
  onSave: (note: string, tags: string[]) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function AnnotationNoteDialog({ annotation, onSave, onDelete, onClose }: AnnotationNoteDialogProps) {
  const [note, setNote] = React.useState(annotation.note || "");
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(annotation.tags || []);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <Dialog isOpen onClose={onClose} title="Annotation Note" maxWidth="max-w-lg">
      <div className="flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">Annotation Note</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
                  {annotation.style} &bull; Chapter {annotation.chapterIndex! + 1}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Your Thoughts</label>
              <textarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your note here..."
                className="w-full h-40 p-4 bg-muted/30 border border-border/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                    <TagIcon className="w-3 h-3" />
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-primary-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter..."
                className="w-full px-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted/10 flex items-center justify-between">
            {onDelete ? (
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-xl transition-all text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <div />
            )}
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 text-muted-foreground hover:bg-muted rounded-xl transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(note, tags)}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all text-sm font-bold"
              >
                <Save className="w-4 h-4" />
                Save Note
              </button>
            </div>
          </div>
      </div>
    </Dialog>
  );
}
