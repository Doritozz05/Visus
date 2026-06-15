import { describe, it, expect } from "vitest";
import { getReaderFontClass, getFontFamilyStyle, getFontFormat, BUILTIN_FONTS } from "../typography";

describe("typography utilities", () => {
  describe("getReaderFontClass", () => {
    it("returns default class if no fontId provided", () => {
      expect(getReaderFontClass()).toBe("antialiased text-justify");
    });

    it("returns correct class for builtin fonts", () => {
      const inter = BUILTIN_FONTS.find(f => f.id === "inter");
      expect(getReaderFontClass("inter")).toBe(inter?.readerClass);
    });

    it("returns default for unknown fonts", () => {
      expect(getReaderFontClass("unknown")).toBe("antialiased text-justify");
    });
  });

  describe("getFontFamilyStyle", () => {
    it("returns inherit if no fontId", () => {
      expect(getFontFamilyStyle()).toBe("inherit");
    });

    it("returns builtin family style", () => {
      const inter = BUILTIN_FONTS.find(f => f.id === "inter");
      expect(getFontFamilyStyle("inter")).toBe(inter?.familyStyle);
    });

    it("handles custom fonts", () => {
      const customFonts = [{
        id: "custom-1",
        name: "My Custom Font",
        fileName: "font.woff2",
        fileType: "font/woff2",
        dataBase64: "...",
        fileSize: 100
      }];
      expect(getFontFamilyStyle("custom-1", customFonts)).toBe("'My Custom Font', sans-serif");
    });

    it("escapes single quotes in custom font names", () => {
      const customFonts = [{
        id: "custom-2",
        name: "Font's Name",
        fileName: "font.woff2",
        fileType: "font/woff2",
        dataBase64: "...",
        fileSize: 100
      }];
      expect(getFontFamilyStyle("custom-2", customFonts)).toBe("'Font\\'s Name', sans-serif");
    });
  });

  describe("getFontFormat", () => {
    it("identifies woff2", () => {
      expect(getFontFormat("font/woff2")).toBe("woff2");
    });
    it("identifies woff", () => {
      expect(getFontFormat("application/x-font-woff")).toBe("woff");
    });
    it("identifies ttf", () => {
      expect(getFontFormat("font/ttf")).toBe("truetype");
      expect(getFontFormat("font/truetype")).toBe("truetype");
    });
    it("identifies otf", () => {
      expect(getFontFormat("font/otf")).toBe("opentype");
    });
    it("defaults to truetype", () => {
      expect(getFontFormat("unknown")).toBe("truetype");
    });
  });
});
