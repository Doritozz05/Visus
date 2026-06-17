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

interface UseAdvancedSelectionReturn {
  selection: SelectionData | null;
  position: Position | null;
  isDragging: boolean;
  clearSelection: () => void;
  startSelection: (wordIndex: number, event: React.MouseEvent | React.TouchEvent) => void;
  updateSelection: (wordIndex: number) => void;
  endSelection: () => void;
  selectWord: (wordIndex: number, event: React.MouseEvent | React.TouchEvent) => void;
}

export function useAdvancedSelection(containerRef: React.RefObject<HTMLElement | null>): UseAdvancedSelectionReturn {
  const [selection, setSelection] = React.useState<SelectionData | null>(null);
  const [position, setPosition] = React.useState<Position | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const anchorIndex = React.useRef<number | null>(null);

  const clearSelection = React.useCallback(() => {
    setSelection(null);
    setPosition(null);
    anchorIndex.current = null;
    
    // Clear visual classes
    if (containerRef.current) {
      containerRef.current.querySelectorAll(".word-selected").forEach((el) => {
        el.classList.remove("word-selected");
      });
    }
  }, [containerRef]);

  // Handle visual application of selection classes via Effect to ensure consistency after re-renders
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous selection first
    container.querySelectorAll(".word-selected").forEach((el) => {
      el.classList.remove("word-selected");
    });

    if (!selection) return;

    const { startWordIndex, endWordIndex } = selection;
    const min = Math.min(startWordIndex, endWordIndex);
    const max = Math.max(startWordIndex, endWordIndex);

    const spans = container.querySelectorAll("span[data-word-index]");
    spans.forEach((node) => {
      const span = node as HTMLElement;
      const idxAttr = span.getAttribute("data-word-index");
      if (idxAttr === null) return;
      
      const idx = parseInt(idxAttr, 10);
      if (idx >= min && idx <= max) {
        span.classList.add("word-selected");
      }
    });
  }, [selection, containerRef]);

  const updateSelectionState = React.useCallback((start: number, end: number) => {
    if (!containerRef.current) return;

    const min = Math.min(start, end);
    const max = Math.max(start, end);

    const spans = containerRef.current.querySelectorAll("span[data-word-index]");
    let text = "";
    const selectedRects: DOMRect[] = [];

    spans.forEach((node) => {
      const span = node as HTMLElement;
      const idxAttr = span.getAttribute("data-word-index");
      if (idxAttr === null) return;
      
      const idx = parseInt(idxAttr, 10);
      if (idx >= min && idx <= max) {
        text += span.innerText + " ";
        selectedRects.push(span.getBoundingClientRect());
      }
    });

    if (selectedRects.length > 0) {
      // Calculate bounding box of selection for toolbar position
      const left = Math.min(...selectedRects.map(r => r.left));
      const right = Math.max(...selectedRects.map(r => r.right));
      const top = Math.min(...selectedRects.map(r => r.top));
      
      const centerX = left + (right - left) / 2;
      const halfToolbarWidth = 175;
      const clampedX = Math.max(halfToolbarWidth + 10, Math.min(window.innerWidth - halfToolbarWidth - 10, centerX));

      setSelection({
        startWordIndex: min,
        endWordIndex: max,
        text: text.trim(),
      });
      setPosition({ x: clampedX, y: top });
    }
  }, [containerRef]);

  const startSelection = React.useCallback((wordIndex: number, event: React.MouseEvent | React.TouchEvent) => {
    // Only handle primary button (0) or touch
    if ('button' in event && event.button !== 0) return;
    
    setIsDragging(true);
    anchorIndex.current = wordIndex;
    updateSelectionState(wordIndex, wordIndex);
  }, [updateSelectionState]);

  const updateSelection = React.useCallback((wordIndex: number) => {
    if (!isDragging || anchorIndex.current === null) return;
    updateSelectionState(anchorIndex.current, wordIndex);
  }, [isDragging, updateSelectionState]);

  const endSelection = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const selectWord = React.useCallback((wordIndex: number, event: React.MouseEvent | React.TouchEvent) => {
    anchorIndex.current = wordIndex;
    updateSelectionState(wordIndex, wordIndex);
    setIsDragging(false);
  }, [updateSelectionState]);

  // Handle global mouse up to stop dragging even if outside container
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging]);

  return {
    selection,
    position,
    isDragging,
    clearSelection,
    startSelection,
    updateSelection,
    endSelection,
    selectWord,
  };
}
