import { useState, useEffect, RefObject, useCallback } from 'react';

export interface ChunkMeasurement {
  index: number;
  offsetTop: number;
  offsetHeight: number;
  offsetLeft: number;
  offsetWidth: number;
}

export function useClusterMeasurements(
  containerRef: RefObject<HTMLElement | null>,
  dependencies: any[]
) {
  const [measurements, setMeasurements] = useState<ChunkMeasurement[]>([]);
  const [isMeasured, setIsMeasured] = useState(false);

  const measure = useCallback(() => {
    if (!containerRef.current) return;

    const spanElements = Array.from(
      containerRef.current.querySelectorAll('[data-chunk-index]')
    ) as HTMLElement[];

    if (spanElements.length === 0) return;

    const newMeasurements = spanElements.map((el) => {
      const index = parseInt(el.getAttribute('data-chunk-index') || '0', 10);
      return {
        index,
        offsetTop: el.offsetTop,
        offsetHeight: el.offsetHeight,
        offsetLeft: el.offsetLeft,
        offsetWidth: el.offsetWidth,
      };
    });

    setMeasurements(newMeasurements);
    setIsMeasured(true);
  }, [containerRef]);

  useEffect(() => {
    // Reset measurement status when dependencies change
    setIsMeasured(false);

    // Give the browser a tick to paint the new DOM before measuring
    const rafId = requestAnimationFrame(() => {
      measure();
    });

    // Setup ResizeObserver to re-measure on container resize
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          measure();
        });
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, measure, containerRef]);

  return { measurements, isMeasured, measure };
}
