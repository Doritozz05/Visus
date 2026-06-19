import { Annotation } from "@/core/entities/book";

export interface UncoveredSegment {
  startWordIndex: number;
  endWordIndex: number;
}

function buildCoverageSet(annotations: Annotation[]): Set<number> {
  const covered = new Set<number>();
  for (const a of annotations) {
    for (let i = a.startWordIndex; i <= a.endWordIndex; i++) {
      covered.add(i);
    }
  }
  return covered;
}

export function getUncoveredSegments(
  start: number,
  end: number,
  existing: Annotation[]
): UncoveredSegment[] {
  const covered = buildCoverageSet(existing);
  const segments: UncoveredSegment[] = [];
  let segStart: number | null = null;

  for (let i = start; i <= end; i++) {
    if (!covered.has(i)) {
      if (segStart === null) segStart = i;
    } else {
      if (segStart !== null) {
        segments.push({ startWordIndex: segStart, endWordIndex: i - 1 });
        segStart = null;
      }
    }
  }

  if (segStart !== null) {
    segments.push({ startWordIndex: segStart, endWordIndex: end });
  }

  return segments;
}
