"use client";

import * as React from "react";
import { ReadingList } from "@/core/entities/reading-list";
import { FolderHeart, Pencil, Trash2, ChevronRight, BookText } from "lucide-react";
import { motion } from "framer-motion";

interface ReadingListCardProps {
  list: ReadingList;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function ReadingListCard({ list, onClick, onEdit, onDelete }: ReadingListCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full mb-3">
        {/* Stack effect layers */}
        <div className="absolute inset-0 bg-primary/5 rounded-2xl translate-x-2 translate-y-2 border border-primary/10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
        <div className="absolute inset-0 bg-card rounded-2xl border border-border/40 shadow-sm liquid-glass z-10 overflow-hidden flex flex-col p-5">
          <div className="flex justify-between items-start mb-auto">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: `${list.color || 'var(--primary)'}20` }}
            >
              <FolderHeart 
                className="w-5 h-5" 
                style={{ color: list.color || 'var(--primary)' }} 
              />
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(e); }}
                className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-primary transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {list.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <BookText className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                {list.bookIds.length} {list.bookIds.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/5 flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-tighter">
              Updated {new Date(list.updatedAt).toLocaleDateString()}
            </span>
            <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CreateListCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="aspect-[4/3] w-full rounded-2xl border-2 border-dashed border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group text-muted-foreground hover:text-primary"
    >
      <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        <FolderHeart className="w-6 h-6 opacity-40 group-hover:opacity-100" />
      </div>
      <span className="text-xs font-bold font-mono uppercase tracking-widest">Create New List</span>
    </motion.button>
  );
}
