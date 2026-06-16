import { useState, useEffect, useCallback, useRef } from "react";

interface UsePlayerVisibilityProps {
  isPlaying: boolean;
  isFocusMode: boolean;
}

export function usePlayerVisibility({ isPlaying, isFocusMode }: UsePlayerVisibilityProps) {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(false);

  // Determine if device has hover capability (Desktop/Mouse)
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasHover(mql.matches);
    
    const handler = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const hide = useCallback(() => {
    if (isPlaying && isFocusMode && !isHoveringRef.current) {
      setIsVisible(false);
    }
  }, [isPlaying, isFocusMode]);

  const restartTimer = useCallback(() => {
    show();
    if (isPlaying && isFocusMode) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(hide, 3000);
    }
  }, [show, hide, isPlaying, isFocusMode]);

  useEffect(() => {
    if (!hasHover) {
      // TOUCH DEVICE: Tap to toggle logic
      const handleGlobalTap = (e: MouseEvent | TouchEvent) => {
        // If we click on the reader content (not the player), toggle
        const target = e.target as HTMLElement;
        const isPlayerClick = target.closest(".reader-player-container");
        
        if (!isPlayerClick) {
          setIsVisible(prev => !prev);
        }
      };

      // Only enable tap-to-toggle in focus mode + playing
      if (isPlaying && isFocusMode) {
        window.addEventListener("click", handleGlobalTap);
        return () => window.removeEventListener("click", handleGlobalTap);
      } else {
        setIsVisible(true);
      }
    } else {
      // DESKTOP DEVICE: Inactivity logic
      if (isPlaying && isFocusMode) {
        restartTimer();
        window.addEventListener("mousemove", restartTimer);
        return () => {
          window.removeEventListener("mousemove", restartTimer);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      } else {
        setIsVisible(true);
      }
    }
  }, [hasHover, isPlaying, isFocusMode, restartTimer]);

  const onPlayerMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    show();
  }, [show]);

  const onPlayerMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    if (isPlaying && isFocusMode) {
      restartTimer();
    }
  }, [isPlaying, isFocusMode, restartTimer]);

  return {
    isVisible: isPlaying && isFocusMode ? isVisible : true,
    onPlayerMouseEnter,
    onPlayerMouseLeave,
    show
  };
}
