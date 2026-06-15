"use client";

import * as React from "react";
import { useReadingList } from "../context/reading-list-context";
import { ReadingListCard, CreateListCard } from "./ReadingListCard";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, Pencil, X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import { createPortal } from "react-dom";

export function ReadingListGrid() {
  const { lists, setActiveListId, createList, updateList, deleteList } = useReadingList();
  const [isCreating, setIsCreating] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [deletingId, setEditingDeleteId] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleCreate = async () => {
    if (newName.trim()) {
      await createList(newName.trim());
      setNewName("");
      setIsCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const list = lists.find(l => l.id === editingId);
    if (list && editName.trim()) {
      await updateList({ ...list, name: editName.trim() });
      setEditingId(null);
      toast.success("List renamed successfully.");
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteList(deletingId);
      setEditingDeleteId(null);
    }
  };

  // Unified Backdrop/Modal logic similar to ConfirmDialog
  const renderModal = (isOpen: boolean, onClose: () => void, icon: React.ReactNode, title: string, subtitle: string, inputVal: string, onInputChange: (val: string) => void, onConfirm: () => void, confirmLabel: string, placeholder?: string) => {
    if (!isOpen || !mounted) return null;

    return createPortal(
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-black/60 transition-opacity animate-in fade-in duration-300"
        />
        
        {/* Dialog Content */}
        <div className="w-full max-w-md bg-card border border-border/30 rounded-2xl p-8 shadow-2xl relative z-10 liquid-glass overflow-hidden animate-scale-up">
          {/* Visual Decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                {icon}
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading text-foreground">{title}</h2>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{subtitle}</p>
              </div>
            </div>

            <input
              autoFocus
              placeholder={placeholder}
              value={inputVal}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onConfirm()}
              className="w-full bg-accent/30 border border-border/40 rounded-2xl px-5 py-4 text-lg font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all mb-8"
            />

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground hover:bg-accent transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={!inputVal.trim()}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-xs font-bold font-mono uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateListCard onClick={() => setIsCreating(true)} />
        
        <AnimatePresence mode="popLayout">
          {lists.map((list) => (
            <ReadingListCard
              key={list.id}
              list={list}
              onClick={() => setActiveListId(list.id)}
              onEdit={(e) => {
                setEditingId(list.id);
                setEditName(list.name);
              }}
              onDelete={(e) => setEditingDeleteId(list.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* RENDER UNIFIED MODALS */}
      {renderModal(
        isCreating,
        () => setIsCreating(false),
        <FolderPlus className="w-6 h-6 text-primary" />,
        "New Collection",
        "Organize your reading journey",
        newName,
        setNewName,
        handleCreate,
        "Create List",
        "List name (e.g. Summer Readings)"
      )}

      {renderModal(
        !!editingId,
        () => setEditingId(null),
        <Pencil className="w-6 h-6 text-primary" />,
        "Rename Collection",
        "Update your list name",
        editName,
        setEditName,
        handleUpdate,
        "Update Name"
      )}

      {/* Delete List Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setEditingDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Collection?"
        description={`This will permanently remove the list "${lists.find(l => l.id === deletingId)?.name}". Books within this list will not be deleted.`}
        confirmLabel="Delete List"
        variant="danger"
      />
    </div>
  );
}
