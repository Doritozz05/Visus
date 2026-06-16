import { useState, useEffect, useCallback, useRef } from "react";

interface UsePlayerVisibilityProps {
  isPlaying: boolean;
  isFocusMode: boolean;
}

export function usePlayerVisibility({ isPlaying, isFocusMode }: UsePlayerVisibilityProps) {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringRef = useRef(false);

  // Refs que reflejan los props SIN causar que los callbacks cambien de identidad
  const isPlayingRef = useRef(isPlaying);
  const isFocusModeRef = useRef(isFocusMode);
  
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isFocusModeRef.current = isFocusMode;
  }, [isPlaying, isFocusMode]);

  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasHover(mql.matches);
    const handler = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // show/hide/restartTimer ahora son ESTABLES para siempre (deps vacías),
  // porque leen isPlaying/isFocusMode desde los refs, no desde closures.
  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible((prev) => (prev ? prev : true));
  }, []);

  const hide = useCallback(() => {
    if (isPlayingRef.current && isFocusModeRef.current && !isHoveringRef.current) {
      setIsVisible(false);
    }
  }, []);

  const restartTimer = useCallback(() => {
    show();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isPlayingRef.current && isFocusModeRef.current) {
      timeoutRef.current = setTimeout(hide, 3000);
    }
  }, [show, hide]);

  // Efecto único: reacciona SOLO a cambios reales de isPlaying/isFocusMode/hasHover.
  // Como restartTimer/show/hide son estables, este efecto no se re-dispara por re-renders ajenos.
  useEffect(() => {
    if (!isPlaying || !isFocusMode) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(true);
      return;
    }

    if (!hasHover) {
      const handleGlobalTap = (e: MouseEvent | TouchEvent) => {
        const target = e.target as HTMLElement;
        const isPlayerClick = target.closest(".reader-player-container");
        if (!isPlayerClick) {
          setIsVisible((prev) => !prev);
        }
      };
      window.addEventListener("click", handleGlobalTap);
      return () => window.removeEventListener("click", handleGlobalTap);
    } else {
      restartTimer();
      window.addEventListener("mousemove", restartTimer);
      return () => {
        window.removeEventListener("mousemove", restartTimer);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [isPlaying, isFocusMode, hasHover, restartTimer]);

  const onPlayerMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    show();
  }, [show]);

  const onPlayerMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    restartTimer();
  }, [restartTimer]);

  return {
    isVisible: isPlaying && isFocusMode ? isVisible : true,
    onPlayerMouseEnter,
    onPlayerMouseLeave,
    show
  };
}
