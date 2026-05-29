import { BookChapter } from "@/core/entities/book";

export function parseTxt(text: string): BookChapter[] {
  if (!text || text.trim() === "") {
    return [{ title: "Section 1", content: "Empty book content." }];
  }
  
  // Clean double-carriage returns and format newlines nicely
  const cleanText = text.replace(/\r\n/g, "\n");
  const words = cleanText.split(/\s+/).filter(w => w.trim() !== "");
  
  const wordsPerChapter = 1500;
  const chapters: BookChapter[] = [];
  
  for (let i = 0; i < words.length; i += wordsPerChapter) {
    const chunk = words.slice(i, i + wordsPerChapter).join(" ");
    const chapterNum = Math.floor(i / wordsPerChapter) + 1;
    chapters.push({
      title: `Section ${chapterNum}`,
      content: chunk
    });
  }
  
  if (chapters.length === 0) {
    chapters.push({ title: "Section 1", content: text });
  }
  
  return chapters;
}
