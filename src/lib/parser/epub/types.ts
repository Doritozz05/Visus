import { BookChapter } from "@/core/entities/book";

export interface ParsedEpub {
  title: string;
  author: string;
  chapters: BookChapter[];
  coverUrl?: string;
  description?: string;
  genres?: string[];
  publisher?: string;
  publishDate?: string;
  language?: string;
}

export interface TocEntry {
  title: string;
  href: string; // Zip path with anchor, e.g. "OEBPS/text/chap1.xhtml#sec1"
  filePath: string; // Zip path to file, e.g. "OEBPS/text/chap1.xhtml"
  anchor?: string; // Anchor ID, e.g. "sec1"
}
