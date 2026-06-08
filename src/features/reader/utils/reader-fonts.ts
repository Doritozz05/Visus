export type ReaderFontFamily = "inter" | "atkinson" | "dyslexic" | "serif";

export const READER_FONT_CLASSES: Record<ReaderFontFamily, string> = {
  inter: "font-sans antialiased text-justify",
  atkinson: "font-sans antialiased text-justify tracking-wide font-medium",
  dyslexic: "font-sans antialiased text-justify tracking-wide font-normal",
  serif: "font-serif antialiased text-justify tracking-normal text-foreground/90",
};

/**
 * Stripped down version for compact speed-reading modes (RSVP/Cluster)
 */
export const SPEED_READER_FONT_CLASSES: Record<Exclude<ReaderFontFamily, "serif">, string> = {
  inter: "font-sans",
  atkinson: "font-sans font-medium tracking-wide",
  dyslexic: "font-sans font-bold tracking-widest",
};
