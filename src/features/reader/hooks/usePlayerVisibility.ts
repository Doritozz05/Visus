import { useState, useEffect, useCallback, useRef } from "react";

interface UsePlayerVisibilityProps {
  isPlaying: boolean;
  isFocusMode: boolean;
}

export function usePlayerVisibility({ isPlaying, isFocusMode }: UsePlayerVisibilityProps) {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringRef = useRef(false);

  // Refs to reflect props WITHOUT causing callbacks to change identity
  const isPlayingRef = useRef(isPlaying);
  
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasHover(mql.matches);
    const handler = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    if (isPlayingRef.current && !isHoveringRef.current) {
      setIsVisible(false);
    }
  }, []);

  const restartTimer = useCallback(() => {
    show();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isPlayingRef.current) {
      timeoutRef.current = setTimeout(hide, 3000);
    }
  }, [show, hide]);

  // Handle global clicks for mobile/tablet
  useEffect(() => {
    if (hasHover) return;

    const handleGlobalTap = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const isPlayerClick = target.closest(".reader-player-container");
      
      // If clicking outside the player, we might want to hide it if it's visible
      // or show it if it's hidden. But specifically, if they click the handle (inside)
      // it should show. The internal button handler will handle that.
      if (!isPlayerClick) {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("click", handleGlobalTap);
    return () => window.removeEventListener("click", handleGlobalTap);
  }, [hasHover]);

  // Handle mouse movement for PC
  useEffect(() => {
    if (!hasHover) return;

    // If not playing, always show
    if (!isPlaying) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(true);
      return;
    }

    // ONLY listen to global mousemove if it's already visible
    // to keep it visible while there is activity.
    // If it's hidden, only the handle/manual show() will trigger it.
    if (isVisible) {
      window.addEventListener("mousemove", restartTimer);
      return () => {
        window.removeEventListener("mousemove", restartTimer);
      };
    }
  }, [isPlaying, hasHover, restartTimer, isVisible]);

  const onPlayerMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    show();
  }, [show]);

  const onPlayerMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    restartTimer();
  }, [restartTimer]);

  return {
    isVisible,
    onPlayerMouseEnter,
    onPlayerMouseLeave,
    show
  };
}
