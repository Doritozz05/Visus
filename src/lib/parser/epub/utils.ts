import JSZip from "jszip";

export function cleanTitle(rawTitle: string): string {
  return rawTitle.replace(/\s+/g, " ").trim();
}

export function normalizeEpubSubject(subject: string): string | null {
  const cleaned = subject.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;

  const subdivisionParts = cleaned
    .split(/\s+--\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  let normalized = subdivisionParts.length > 1
    ? subdivisionParts[subdivisionParts.length - 1]
    : cleaned;

  const trailingParenthetical = normalized.match(/\(([^)]+)\)\s*$/);
  if (trailingParenthetical) {
    normalized = trailingParenthetical[1].trim();
  }

  normalized = normalized.replace(/\s+/g, " ").trim();
  return normalized || null;
}

export function getGeneralEpubGenres(subjects: string[]): string[] {
  const genres: string[] = [];
  const seen = new Set<string>();

  subjects.forEach((subject) => {
    const normalized = normalizeEpubSubject(subject);
    if (!normalized) return;

    const key = normalized.toLowerCase();
    if (seen.has(key)) return;

    seen.add(key);
    genres.push(normalized);
  });

  return genres;
}

export function resolveRelativePath(baseDir: string, relativePath: string): string {
  const decodedPath = decodeURIComponent(relativePath);
  const parts = (baseDir + decodedPath).split("/");
  const stack: string[] = [];
  
  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  
  return stack.join("/");
}

export async function loadImageAsBase64(zip: JSZip, cleanPath: string): Promise<string | null> {
  let file = zip.file(cleanPath);
  if (!file) {
    const matchedKey = Object.keys(zip.files).find(k => k.toLowerCase() === cleanPath.toLowerCase());
    if (matchedKey) file = zip.file(matchedKey);
  }
  
  if (!file) return null;
  
  try {
    const base64 = await file.async("base64");
    const ext = cleanPath.split(".").pop()?.toLowerCase();
    let mimeType = "image/jpeg";
    if (ext === "png") mimeType = "image/png";
    else if (ext === "gif") mimeType = "image/gif";
    else if (ext === "svg") mimeType = "image/svg+xml";
    
    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.warn(`Could not load image at ${cleanPath} from zip:`, err);
    return null;
  }
}
