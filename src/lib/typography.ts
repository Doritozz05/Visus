export interface BuiltInFont {
  id: string;
  name: string;
  description: string;
  type: "ui" | "reader" | "both";
  familyStyle: string;
  desc?: string; // fallback matching previous forms
  readerClass?: string; // Specific tailwind classes for the reader (tracking, weight, etc.)
}

export interface CustomFont {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  dataBase64: string; // Base64 encoding of the binary file
  fileSize: number;
}

export const BUILTIN_FONTS: BuiltInFont[] = [
  {
    id: "inter",
    name: "Inter",
    desc: "Standard Sans",
    description: "Sleek and clean neo-grotesque sans-serif",
    type: "both",
    familyStyle: "'Inter', var(--font-sans), sans-serif",
    readerClass: "font-sans antialiased text-justify"
  },
  {
    id: "outfit",
    name: "Outfit",
    desc: "Geometric",
    description: "Modern, warm geometric design",
    type: "both",
    familyStyle: "'Outfit', var(--font-heading), sans-serif",
    readerClass: "font-sans antialiased text-justify"
  },
  {
    id: "hanken",
    name: "Hanken Grotesk",
    desc: "Grotesk",
    description: "Sophisticated grotesque typeface",
    type: "both",
    familyStyle: "'Hanken Grotesk', var(--font-hanken), sans-serif",
    readerClass: "font-sans antialiased text-justify"
  },
  {
    id: "system-ui",
    name: "System default",
    desc: "System UI",
    description: "Default operating system font stack",
    type: "both",
    familyStyle: "system-ui, -apple-system, sans-serif",
    readerClass: "antialiased text-justify"
  },
  {
    id: "serif",
    name: "Lora Serif",
    desc: "Book Classic",
    description: "Classic book typeface for long reading sessions",
    type: "both",
    familyStyle: "'Lora', var(--font-serif), Georgia, serif",
    readerClass: "font-serif antialiased text-justify tracking-normal text-foreground/90"
  },
  {
    id: "atkinson",
    name: "Atkinson",
    desc: "Hyperlegible",
    description: "Optimized for visual recognition",
    type: "both",
    familyStyle: "'Atkinson Hyperlegible', sans-serif",
    readerClass: "font-sans antialiased text-justify tracking-wide font-medium"
  },
  {
    id: "dyslexic",
    name: "Dyslexic",
    desc: "Accessibility",
    description: "Accessibility design for reading assistance",
    type: "both",
    familyStyle: "'OpenDyslexic', sans-serif",
    readerClass: "font-sans antialiased text-justify tracking-wide font-normal"
  },
  {
    id: "mono",
    name: "JetBrains Mono",
    desc: "Monospace",
    description: "Crisp monospace for technical clarity",
    type: "both",
    familyStyle: "'JetBrains Mono', var(--font-mono), monospace",
    readerClass: "font-mono antialiased text-justify"
  },
  {
    id: "sans-serif",
    name: "Sans-Serif",
    desc: "Standard Sans",
    description: "Standard sans-serif font stack",
    type: "both",
    familyStyle: "sans-serif",
    readerClass: "antialiased text-justify"
  }
];

export const getReaderFontClass = (fontId?: string): string => {
  if (!fontId) return "antialiased text-justify";
  const builtin = BUILTIN_FONTS.find(f => f.id === fontId);
  return builtin?.readerClass || "antialiased text-justify";
};

export const getFontFamilyStyle = (fontId?: string, customFonts: CustomFont[] = []): string => {
  if (!fontId) return "inherit";

  const builtin = BUILTIN_FONTS.find(f => f.id === fontId);
  if (builtin) return builtin.familyStyle;

  // Check custom fonts
  const custom = customFonts.find(f => f.id === fontId || f.name === fontId);
  if (custom) {
    // Escape single quotes in font name if any
    const safeName = custom.name.replace(/'/g, "\\'");
    return `'${safeName}', sans-serif`;
  }

  // Fallback to direct name (e.g. if themeState saved name directly)
  return `'${fontId.replace(/'/g, "\\'")}', sans-serif`;
};

export const getFontFormat = (fileType: string): string => {
  const type = fileType.toLowerCase();
  if (type.includes("woff2")) return "woff2";
  if (type.includes("woff")) return "woff";
  if (type.includes("ttf") || type.includes("truetype")) return "truetype";
  if (type.includes("otf") || type.includes("opentype")) return "opentype";
  return "truetype";
};
