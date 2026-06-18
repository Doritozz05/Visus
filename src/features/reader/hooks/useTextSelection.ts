import * as React from "react";

export interface SelectionData {
  startWordIndex: number;
  endWordIndex: number;
  text: string;
}

export interface Position {
  x: number;
  y: number;
}

interface UseTextSelectionReturn {
  selection: SelectionData | null;
  position: Position | null;
  isDragging: boolean;
  clearSelection: () => void;
  updateSelection: () => void;
  selectWord: (wordIndex: number) => void;
}

export function useTextSelection(containerRef: React.RefObject<HTMLElement | null>): UseTextSelectionReturn {
  const [selection, setSelection] = React.useState<SelectionData | null>(null);
  const [position, setPosition] = React.useState<Position | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const selectionTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const updateSelectionData = React.useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !containerRef.current) {
      setSelection(null);
      setPosition(null);
      return;
    }

    // Check if selection is within our container
    try {
      if (!containerRef.current.contains(sel.anchorNode) || !containerRef.current.contains(sel.focusNode)) {
        return;
      }
    } catch (e) {
      return;
    }

    const getWordIndexFromNode = (node: Node | null): number | null => {
      if (!node) return null;
      
      let current: HTMLElement | null = null;
      if (node.nodeType === Node.TEXT_NODE) {
        current = node.parentElement;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        current = node as HTMLElement;
      }

      while (current && containerRef.current && containerRef.current.contains(current)) {
        const indexAttr = current.getAttribute("data-word-index");
        if (indexAttr !== null) {
          return parseInt(indexAttr, 10);
        }
        current = current.parentElement;
      }
      return null;
    };

    const anchorIndex = getWordIndexFromNode(sel.anchorNode);
    const focusIndex = getWordIndexFromNode(sel.focusNode);

    if (anchorIndex !== null && focusIndex !== null) {
      const startWordIndex = Math.min(anchorIndex, focusIndex);
      const endWordIndex = Math.max(anchorIndex, focusIndex);

      const range = sel.getRangeAt(0);
      const boundingRect = range.getBoundingClientRect();
      const centerX = boundingRect.left + boundingRect.width / 2;

      // Adjust toolbar position logic
      const halfToolbarWidth = 175;
      const clampedX = Math.max(halfToolbarWidth + 10, Math.min(window.innerWidth - halfToolbarWidth - 10, centerX));

      setSelection({
        startWordIndex,
        endWordIndex,
        text: sel.toString().trim(),
      });
      setPosition({ x: clampedX, y: boundingRect.top });
    }
  }, [containerRef]);

  const clearSelection = React.useCallback(() => {
    setSelection(null);
    setPosition(null);
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  }, []);

  const selectWord = React.useCallback((wordIndex: number) => {
    if (!containerRef.current) return;
    const span = containerRef.current.querySelector(`span[data-word-index="${wordIndex}"]`);
    if (!span) return;

    const sel = window.getSelection();
    if (!sel) return;

    const range = document.createRange();
    range.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(range);
    
    // Trigger update immediately
    setTimeout(() => updateSelectionData(), 0);
  }, [containerRef, updateSelectionData]);

  React.useEffect(() => {
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      // Don't clear if clicking inside the toolbar or context menu
      const target = e.target as HTMLElement;
      if (target.closest(".selection-toolbar") || target.closest(".context-menu-container")) {
        return;
      }
      
      setIsDragging(true);
      if (selectionTimeout.current) clearTimeout(selectionTimeout.current);
    };

    const handleMouseUp = (e: MouseEvent | TouchEvent) => {
      setIsDragging(false);
      
      // Small delay to ensure the native selection is finalized
      setTimeout(() => {
        updateSelectionData();
      }, 10);
    };

    const handleSelectionChange = () => {
      // If the user is still dragging, don't update yet to avoid flickering
      if (isDragging) return;

      if (selectionTimeout.current) clearTimeout(selectionTimeout.current);
      
      selectionTimeout.current = setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setSelection(null);
          setPosition(null);
        } else {
          updateSelectionData();
        }
      }, 20);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("touchstart", handleMouseDown);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("touchstart", handleMouseDown);
      document.removeEventListener("touchend", handleMouseUp);
      if (selectionTimeout.current) clearTimeout(selectionTimeout.current);
    };
  }, [updateSelectionData, isDragging]);

  return { selection, position, isDragging, clearSelection, updateSelection: updateSelectionData, selectWord };
}
