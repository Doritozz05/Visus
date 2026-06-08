import JSZip from "jszip";
import { 
  cleanTitle, 
  getGeneralEpubGenres, 
  loadImageAsBase64 
} from "./utils";

export interface EpubMetadata {
  title: string;
  author: string;
  description?: string;
  publisher?: string;
  publishDate?: string;
  language?: string;
  genres?: string[];
  coverUrl?: string;
  manifestItems: Map<string, string>;
  manifestProperties: Map<string, string>;
}

export async function extractEpubMetadata(
  zip: JSZip,
  opfXml: Document,
  opfDir: string
): Promise<EpubMetadata> {
  // Extract Metadata
  const titleEl = opfXml.querySelector("title, dc\\:title");
  const creatorEl = opfXml.querySelector("creator, dc\\:creator");
  const title = titleEl?.textContent ? cleanTitle(titleEl.textContent) : "Unknown Title";
  const author = creatorEl?.textContent ? cleanTitle(creatorEl.textContent) : "Unknown Author";
  
  const descriptionEl = opfXml.querySelector("description, dc\\:description");
  const description = descriptionEl?.textContent?.trim() || undefined;
  
  const publisherEl = opfXml.querySelector("publisher, dc\\:publisher");
  const publisher = publisherEl?.textContent?.trim() || undefined;
  
  const dateEl = opfXml.querySelector("date, dc\\:date");
  const publishDate = dateEl?.textContent?.trim() || undefined;
  
  const languageEl = opfXml.querySelector("language, dc\\:language");
  const language = languageEl?.textContent?.trim() || undefined;
  
  const subjectEls = opfXml.querySelectorAll("subject, dc\\:subject");
  const rawSubjects: string[] = [];
  subjectEls.forEach((el) => {
    const text = el.textContent?.trim();
    if (text) rawSubjects.push(text);
  });
  const genres = getGeneralEpubGenres(rawSubjects);
  
  // Parse Manifest (id -> href)
  const manifestItems = new Map<string, string>();
  const manifestProperties = new Map<string, string>();
  const items = opfXml.querySelectorAll("manifest > item");
  items.forEach((item) => {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");
    const properties = item.getAttribute("properties");
    if (id && href) {
      manifestItems.set(id, href);
      if (properties) {
        manifestProperties.set(id, properties);
      }
    }
  });
  
  // Extract cover image
  let coverUrl: string | undefined = undefined;
  let coverHref: string | null = null;
  
  items.forEach((item) => {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");
    const properties = item.getAttribute("properties");
    if (properties === "cover-image" && href) {
      coverHref = href;
    } else if ((id === "cover" || id === "cover-image" || id === "cover-img") && href && !coverHref) {
      coverHref = href;
    }
  });
  
  if (!coverHref) {
    const coverMeta = opfXml.querySelector("meta[name='cover']");
    const coverId = coverMeta?.getAttribute("content");
    if (coverId) {
      const href = manifestItems.get(coverId);
      if (href) coverHref = href;
    }
  }
  
  if (coverHref) {
    try {
      const fullCoverPath = opfDir + coverHref;
      const cleanCoverPath = decodeURIComponent(fullCoverPath.split("#")[0]);
      const coverBase64 = await loadImageAsBase64(zip, cleanCoverPath);
      if (coverBase64) coverUrl = coverBase64;
    } catch (coverErr) {
      console.warn("Could not extract cover image:", coverErr);
    }
  }

  return {
    title,
    author,
    description,
    publisher,
    publishDate,
    language,
    genres: genres.length > 0 ? genres : undefined,
    coverUrl,
    manifestItems,
    manifestProperties
  };
}
