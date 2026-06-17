"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Position, SelectionData } from "../hooks/useTextSelection";
import {
  Type,
  Underline,
  PenLine,
  BookOpen,
  Copy,
  Search,
  Volume2,
  Trash2,
  X,
  MessageSquare
} from "lucide-react";
import { Annotation } from "@/core/entities/book";

interface SelectionToolbarProps {
  selection: SelectionData | null;
  position: Position | null;
  existingAnnotation?: Annotation | null;
  onHighlight: (color: string) => void;
  onUnderline: (style: Annotation["style"]) => void;
  onAddNote: () => void;
  onDictionary: () => void;
  onCopy: () => void;
  onSearch: () => void;
  onTTS: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

const COLORS = [
  { label: "Yellow", value: "var(--highlight-yellow, #fef08a)" },
  { label: "Green", value: "var(--highlight-green, #bbf7d0)" },
  { label: "Blue", value: "var(--highlight-blue, #bfdbfe)" },
  { label: "Pink", value: "var(--highlight-pink, #fbcfe8)" },
];

const STYLES: { label: string; value: Annotation["style"], icon: React.ReactNode }[] = [
  { label: "Solid", value: "underline", icon: <Underline className="w-4 h-4" /> },
  { label: "Dashed", value: "dashed", icon: <Type className="w-4 h-4" /> },
  { label: "Wavy", value: "wavy", icon: <Type className="w-4 h-4" /> },
];

export function SelectionToolbar({
  selection,
  position,
  existingAnnotation,
  onHighlight,
  onUnderline,
  onAddNote,
  onDictionary,
  onCopy,
  onSearch,
  onTTS,
  onDelete,
  onClose
}: SelectionToolbarProps) {
  if (!selection || !position) return null;

  // Final top calculation: at least 10px from top, or 60px above selection
  const toolbarY = Math.max(10, position.y - 65);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          position: "fixed",
          left: position.x,
          top: toolbarY,
          transform: "translateX(-50%)",
          zIndex: 10000, // Ensure it's above almost everything
        }}
        className="selection-toolbar flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/95 dark:bg-zinc-800/95 backdrop-blur-md text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 select-none"
      >
        {/* Colors */}
        <div className="flex items-center gap-1 border-r border-zinc-700 pr-2">
          {COLORS.map((c) => (
            <button
              key={c.label}
              onClick={() => onHighlight(c.value)}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
              style={{ backgroundColor: c.value }}
              title={`Highlight ${c.label}`}
            >
              {existingAnnotation?.color === c.value && <PenLine className="w-3 h-3 text-black/50" />}
            </button>
          ))}
        </div>

        {/* Styles (Underlines) */}
        <div className="flex items-center gap-1 border-r border-zinc-700 pr-2 pl-1">
          {STYLES.map((s) => (
            <button
              key={s.label}
              onClick={() => onUnderline(s.value)}
              className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors focus:outline-none"
              title={`Underline ${s.label}`}
            >
              {s.icon}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-1 pr-1">
          <button onClick={onAddNote} className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors" title="Add Note">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button onClick={onDictionary} className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors" title="Dictionary">
            <BookOpen className="w-4 h-4" />
          </button>
          <button onClick={onCopy} className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors" title="Copy Text">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={onSearch} className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors" title="Search Book">
            <Search className="w-4 h-4" />
          </button>
          <button onClick={onTTS} className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors" title="Read Aloud">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Delete / Close */}
        <div className="flex items-center gap-1 border-l border-zinc-700 pl-2">
          {existingAnnotation && onDelete && (
            <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 transition-colors" title="Delete Annotation">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors" title="Close Menu">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
