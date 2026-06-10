import { BookVisualPage } from "@/lib/parser/paginator";

export function findPageForWordIndex(
  pages: BookVisualPage[],
  chapterIndex: number,
  wordIndex: number
): BookVisualPage | undefined {
  if (pages.length === 0) return undefined;

  let left = 0;
  let right = pages.length - 1;

  while (left <= right) {
    const mid = (left + right) >> 1;
    const page = pages[mid];

    if (page.chapterIndex < chapterIndex) {
      left = mid + 1;
    } else if (page.chapterIndex > chapterIndex) {
      right = mid - 1;
    } else {
      // In the correct chapter, now check wordIndex
      if (wordIndex < page.startWordIndex) {
        right = mid - 1;
      } else if (wordIndex > page.endWordIndex) {
        left = mid + 1;
      } else {
        return page; // Found the exact page
      }
    }
  }

  return undefined;
}

export function findFirstPageOfChapter(
  pages: BookVisualPage[],
  chapterIndex: number
): BookVisualPage | undefined {
  if (pages.length === 0) return undefined;

  let left = 0;
  let right = pages.length - 1;
  let firstPage: BookVisualPage | undefined;

  while (left <= right) {
    const mid = (left + right) >> 1;
    const page = pages[mid];

    if (page.chapterIndex < chapterIndex) {
      left = mid + 1;
    } else if (page.chapterIndex > chapterIndex) {
      right = mid - 1;
    } else {
      firstPage = page;
      right = mid - 1; // Keep looking left
    }
  }

  return firstPage;
}

export function findLastPageOfChapter(
  pages: BookVisualPage[],
  chapterIndex: number
): BookVisualPage | undefined {
  if (pages.length === 0) return undefined;

  let left = 0;
  let right = pages.length - 1;
  let lastPage: BookVisualPage | undefined;

  while (left <= right) {
    const mid = (left + right) >> 1;
    const page = pages[mid];

    if (page.chapterIndex < chapterIndex) {
      left = mid + 1;
    } else if (page.chapterIndex > chapterIndex) {
      right = mid - 1;
    } else {
      lastPage = page;
      left = mid + 1; // Keep looking right
    }
  }

  return lastPage;
}

export function findPageForPageIndex(
  pages: BookVisualPage[],
  chapterIndex: number,
  pageIndex: number
): BookVisualPage | undefined {
  if (pages.length === 0) return undefined;

  let left = 0;
  let right = pages.length - 1;

  while (left <= right) {
    const mid = (left + right) >> 1;
    const page = pages[mid];

    if (page.chapterIndex < chapterIndex) {
      left = mid + 1;
    } else if (page.chapterIndex > chapterIndex) {
      right = mid - 1;
    } else {
      if (page.pageIndex < pageIndex) {
        left = mid + 1;
      } else if (page.pageIndex > pageIndex) {
        right = mid - 1;
      } else {
        return page;
      }
    }
  }

  return undefined;
}
