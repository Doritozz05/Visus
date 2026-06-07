import { BookChapter } from "@/core/entities/book";

export function isStandaloneSection(title: string): boolean {
  const t = title.toUpperCase().trim();
  return (
    t.includes("TITLE PAGE") ||
    t.includes("CONTENTS") ||
    t.includes("TABLE OF CONTENTS") ||
    t.includes("PROLOGUE") ||
    t.includes("PREFACE") ||
    t.includes("ACT ") ||
    t.includes("ACTI") ||
    t.includes("SCENE") ||
    t.includes("CHAPTER") ||
    t.includes("EPILOGUE") ||
    t.includes("DEDICATION") ||
    t.includes("INTRODUCTION") ||
    t.includes("INTRO")
  );
}

export function postProcessChapters(rawChapters: BookChapter[]): BookChapter[] {
  if (rawChapters.length <= 1) return rawChapters;
  
  const processed: BookChapter[] = [];
  let current = { ...rawChapters[0] };
  
  for (let i = 1; i < rawChapters.length; i++) {
    const next = rawChapters[i];
    
    const currentWordCount = current.content.split(/\s+/).filter(Boolean).length;
    const nextWordCount = next.content.split(/\s+/).filter(Boolean).length;
    
    // Standalone sections should NEVER be merged
    const currentIsStandalone = isStandaloneSection(current.title);
    const nextIsStandalone = isStandaloneSection(next.title);
    
    if (currentIsStandalone || nextIsStandalone) {
      processed.push(current);
      current = { ...next };
      continue;
    }
    
    // Heuristics 1: Merge adjacent cover title & subtitle fragments
    const isContinuation = 
      /^[a-z]/.test(next.title) || 
      next.title.toLowerCase().startsWith("or ") || 
      next.title.toLowerCase().startsWith("and ") ||
      current.title.endsWith(";") || 
      current.title.endsWith(",");
      
    // Only merge if it's a clear continuation and very short, OR if next is an extremely tiny fragment without substantive content (e.g. < 15 words)
    const isTinyFragment = nextWordCount < 15;
    
    if ((nextWordCount < 150 && isContinuation) || isTinyFragment) {
      // Merge titles cleanly
      if (current.title.endsWith(";")) {
        current.title = `${current.title} ${next.title}`;
      } else if (current.title.toLowerCase() === next.title.toLowerCase()) {
        // Keep current title
      } else {
        current.title = `${current.title} - ${next.title}`;
      }
      
      // Merge plain and HTML content
      current.content = `${current.content}\n\n${next.content}`;
      if (current.htmlContent && next.htmlContent) {
        current.htmlContent = `${current.htmlContent}\n${next.htmlContent}`;
      } else if (next.htmlContent) {
        current.htmlContent = next.htmlContent;
      }
    } else {
      processed.push(current);
      current = { ...next };
    }
  }
  processed.push(current);
  
  return processed;
}
