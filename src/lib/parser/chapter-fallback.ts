export function buildChaptersData(
  activeBookId: string | null,
  activeBookChapters: any[] | undefined,
  activeBookContent: string | undefined
) {
  if (!activeBookId) return [];
  
  let rawChapters = activeBookChapters || [];
  
  if (rawChapters.length === 0 && activeBookContent) {
    const paragraphs = activeBookContent.split(/\n\s*\n+/).filter(p => p.trim() !== "");
    const legacyChapters = [];
    for (let i = 0; i < paragraphs.length; i += 6) {
      const title = `Section ${Math.floor(i / 6) + 1}`;
      const content = paragraphs.slice(i, i + 6).join("\n\n");
      legacyChapters.push({ title, content });
    }
    rawChapters = legacyChapters;
  }

  if (rawChapters.length === 0) {
    rawChapters = [{
      title: "Section 1",
      content: activeBookContent || "Empty book content."
    }];
  }

  return rawChapters.map((ch, idx) => ({
    ...ch,
    index: idx,
  }));
}
