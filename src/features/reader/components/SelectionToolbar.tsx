"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Position, SelectionData } from "../hooks/useTextSelection";
import {
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
import { QuickColorPicker } from "./QuickColorPicker";

interface SelectionToolbarProps {
  selection: SelectionData | null;
  position: Position | null;
  existingAnnotation?: Annotation | null;
  onHighlight: (color: string) => void;
  onAddNote: () => void;
  onDictionary: () => void;
  onCopy: () => void;
  onSearch: () => void;
  onTTS: () => void;
  onDelete?: () => void;
  onClose: () => void;
  currentColor?: string;
}

export function SelectionToolbar({
  selection,
  position,
  existingAnnotation,
  onHighlight,
  onAddNote,
  onDictionary,
  onCopy,
  onSearch,
  onTTS,
  onDelete,
  onClose,
  currentColor = "#fef08a",
}: SelectionToolbarProps) {
  if (!selection || !position) return null;

  const toolbarY = Math.max(10, position.y - 65);

  const isEditMode = !!existingAnnotation;

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
          zIndex: 10000,
        }}
        className="selection-toolbar flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/95 dark:bg-zinc-800/95 backdrop-blur-md text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 select-none"
      >
        {/* Color Picker */}
        <div className="flex items-center gap-1.5 border-r border-zinc-700 pr-2">
          <QuickColorPicker
            value={currentColor}
            onChange={(color) => onHighlight(color)}
            size="sm"
          />
          {!isEditMode && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onHighlight(currentColor)}
              className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 hover:text-white transition-colors px-1"
              title="Highlight with current color"
            >
              <PenLine className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-1">
          {isEditMode ? (
            <>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onAddNote}
                className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
                title={existingAnnotation?.note ? "Edit note" : "Add note"}
              >
                <MessageSquare className={`w-4 h-4 ${existingAnnotation?.note ? "text-blue-400" : ""}`} />
              </button>
              {onDelete && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={onDelete}
                  className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Delete annotation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onAddNote}
                className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
                title="Add note"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onDictionary}
                className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
                title="Dictionary"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onCopy}
                className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
                title="Copy text"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onSearch}
                className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
                title="Search book"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onTTS}
                className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
                title="Read aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Close */}
        <div className="flex items-center gap-1 border-l border-zinc-700 pl-2">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-zinc-700 transition-colors"
            title="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
