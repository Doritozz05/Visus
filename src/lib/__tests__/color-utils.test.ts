import { describe, it, expect } from "vitest";
import { resolveColor, hexToRgba, hexToHsl, COLOR_PRESETS } from "../color-utils";

describe("color-utils", () => {
  describe("resolveColor", () => {
    it("resolves presets", () => {
      expect(resolveColor("violet")).toBe(COLOR_PRESETS.violet);
      expect(resolveColor("VIOLET")).toBe(COLOR_PRESETS.violet);
    });

    it("returns hex as-is", () => {
      expect(resolveColor("#123456")).toBe("#123456");
    });

    it("returns css variables as-is", () => {
      expect(resolveColor("var(--primary)")).toBe("var(--primary)");
    });

    it("returns white for empty", () => {
      expect(resolveColor("")).toBe("#ffffff");
    });
  });

  describe("hexToRgba", () => {
    it("converts 6-digit hex", () => {
      expect(hexToRgba("#ffffff", 0.5)).toBe("rgba(255, 255, 255, 0.5)");
      expect(hexToRgba("#000000", 1)).toBe("rgba(0, 0, 0, 1)");
    });

    it("converts 3-digit hex", () => {
      expect(hexToRgba("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
    });

    it("handles presets", () => {
      // violet is #8b5cf6 -> r: 139, g: 92, b: 246
      expect(hexToRgba("violet", 1)).toBe("rgba(139, 92, 246, 1)");
    });

    it("returns as-is for non-hex non-preset", () => {
      expect(hexToRgba("var(--test)", 1)).toBe("var(--test)");
    });
  });

  describe("hexToHsl", () => {
    it("converts hex to hsl", () => {
      const white = hexToHsl("#ffffff");
      expect(white.h).toBe(0);
      expect(white.s).toBe(0);
      expect(white.l).toBe(100);
      expect(white.stringVal).toBe("0 0% 100%");

      const black = hexToHsl("#000000");
      expect(black.l).toBe(0);
    });

    it("handles presets", () => {
      const violet = hexToHsl("violet");
      expect(violet.h).toBeGreaterThan(250);
      expect(violet.h).toBeLessThan(270);
    });

    it("returns fallback for invalid colors", () => {
      const fallback = hexToHsl("invalid");
      expect(fallback.h).toBe(260); // Default violet fallback in code
    });
  });
});
