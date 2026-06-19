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
  selectRange: (startWordIndex: number, endWordIndex: number) => void;
}

export function useTextSelection(containerRef: React.RefObject<HTMLElement | null>): UseTextSelectionReturn {
  const [selection, setSelection] = React.useState<SelectionData | null>(null);
  const [position, setPosition] = React.useState<Position | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const selectionTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const getWordIndexFromNode = React.useCallback((node: Node | null, offset: number = 0): number | null => {
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

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (offset < element.childNodes.length) {
        const child = element.childNodes[offset];
        return getWordIndexFromNode(child, 0);
      } else if (element.childNodes.length > 0) {
        return getWordIndexFromNode(element.childNodes[element.childNodes.length - 1], 0);
      }
    }

    if (node.nodeType === Node.TEXT_NODE && (!node.textContent || node.textContent.trim().length === 0)) {
      let next = node.nextSibling;
      while (next) {
        if (next.nodeType === Node.ELEMENT_NODE && (next as HTMLElement).hasAttribute("data-word-index")) {
          return parseInt((next as HTMLElement).getAttribute("data-word-index")!, 10);
        }
        next = next.nextSibling;
      }
      let prev = node.previousSibling;
      while (prev) {
        if (prev.nodeType === Node.ELEMENT_NODE && (prev as HTMLElement).hasAttribute("data-word-index")) {
          return parseInt((prev as HTMLElement).getAttribute("data-word-index")!, 10);
        }
        prev = prev.previousSibling;
      }
    }

    return null;
  }, [containerRef]);

  const updateSelectionData = React.useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !containerRef.current) {
      setSelection(null);
      setPosition(null);
      return;
    }

    try {
      if (!containerRef.current.contains(sel.anchorNode) || !containerRef.current.contains(sel.focusNode)) {
        return;
      }
    } catch (e) {
      return;
    }

    const anchorIndex = getWordIndexFromNode(sel.anchorNode, sel.anchorOffset);
    const focusIndex = getWordIndexFromNode(sel.focusNode, sel.focusOffset);

    if (anchorIndex !== null && focusIndex !== null) {
      const startWordIndex = Math.min(anchorIndex, focusIndex);
      const endWordIndex = Math.max(anchorIndex, focusIndex);

      const range = sel.getRangeAt(0);
      const boundingRect = range.getBoundingClientRect();
      
      if (boundingRect.width === 0 && boundingRect.height === 0 && range.startContainer.nodeType === Node.ELEMENT_NODE) {
      }

      const centerX = boundingRect.left + boundingRect.width / 2;

      const halfToolbarWidth = 175;
      const clampedX = Math.max(halfToolbarWidth + 10, Math.min(window.innerWidth - halfToolbarWidth - 10, centerX));

      setSelection({
        startWordIndex,
        endWordIndex,
        text: sel.toString().trim(),
      });
      setPosition({ x: clampedX, y: boundingRect.top });
    } else {
      setSelection(null);
      setPosition(null);
    }
  }, [containerRef, getWordIndexFromNode]);

  const clearSelection = React.useCallback(() => {
    setSelection(null);
    setPosition(null);
    const sel = window.getSelection();
    if (sel) {
      try {
        sel.removeAllRanges();
      } catch (e) {
      }
    }
  }, []);

  const selectRange = React.useCallback((startWordIndex: number, endWordIndex: number) => {
    if (!containerRef.current) return;

    const startSpan = containerRef.current.querySelector(`span[data-word-index="${startWordIndex}"]`) as HTMLElement;
    const endSpan = containerRef.current.querySelector(`span[data-word-index="${endWordIndex}"]`) as HTMLElement;
    if (!startSpan || !endSpan) return;

    const sel = window.getSelection();
    if (!sel) return;

    const range = document.createRange();
    range.selectNodeContents(startSpan);

    if (startWordIndex !== endWordIndex && endSpan) {
      range.setEndAfter(endSpan);
    }

    sel.removeAllRanges();
    sel.addRange(range);

    updateSelectionData();
  }, [containerRef, updateSelectionData]);

  const selectWord = React.useCallback((wordIndex: number) => {
    selectRange(wordIndex, wordIndex);
  }, [selectRange]);

  React.useEffect(() => {
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".selection-toolbar") || target.closest(".context-menu-container")) {
        return;
      }
      
      if (e instanceof MouseEvent && e.button === 2 && selection) {
        return;
      }

      setIsDragging(true);
      if (selectionTimeout.current) clearTimeout(selectionTimeout.current);
    };

    const handleMouseUp = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent && e.button === 2 && selection) {
        setIsDragging(false);
        return;
      }

      setIsDragging(false);
      
      requestAnimationFrame(() => {
        updateSelectionData();
      });
    };

    const handleSelectionChange = () => {
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
      }, 50);
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

  return { selection, position, isDragging, clearSelection, updateSelection: updateSelectionData, selectWord, selectRange };
}
