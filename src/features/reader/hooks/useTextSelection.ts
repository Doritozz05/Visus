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
  clearSelection: () => void;
}

export function useTextSelection(containerRef: React.RefObject<HTMLElement | null>): UseTextSelectionReturn {
  const [selection, setSelection] = React.useState<SelectionData | null>(null);
  const [position, setPosition] = React.useState<Position | null>(null);

  const clearSelection = React.useCallback(() => {
    setSelection(null);
    setPosition(null);
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  }, []);

  React.useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !containerRef.current) {
        // Only clear if we actually have something, to avoid unnecessary state updates
        setSelection((prev) => prev ? null : prev);
        setPosition((prev) => prev ? null : prev);
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

      // Extract word indices
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
          // If we are at a span that doesn't have it, but might be a wrapper, 
          // or if we are at a paragraph, we might need to look at children if the node was a block.
          // But with our new paginator, every word is a span.
          current = current.parentElement;
        }
        return null;
      };

      const anchorIndex = getWordIndexFromNode(sel.anchorNode);
      const focusIndex = getWordIndexFromNode(sel.focusNode);

      if (anchorIndex !== null && focusIndex !== null) {
        const startWordIndex = Math.min(anchorIndex, focusIndex);
        const endWordIndex = Math.max(anchorIndex, focusIndex);

        // Get positioning
        const range = sel.getRangeAt(0);
        const rects = range.getClientRects();
        if (rects.length === 0) return;

        // Use the first rect for the top position
        const firstRect = rects[0];
        // Use the bounding rect for the horizontal center
        const boundingRect = range.getBoundingClientRect();
        const centerX = boundingRect.left + boundingRect.width / 2;

        // Clamp X position to avoid clipping at edges (toolbar is roughly 350px wide)
        const halfToolbarWidth = 175;
        const clampedX = Math.max(halfToolbarWidth + 10, Math.min(window.innerWidth - halfToolbarWidth - 10, centerX));

        setSelection({
          startWordIndex,
          endWordIndex,
          text: sel.toString().trim(),
        });
        setPosition({ x: clampedX, y: firstRect.top });
      }
    };

    // Use selectionchange for real-time tracking
    document.addEventListener("selectionchange", handleSelectionChange);
    // Also keep mouseup/touchend to ensure we catch the final state correctly
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("touchend", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("touchend", handleSelectionChange);
    };
  }, [containerRef]);

  return { selection, position, clearSelection };
}
