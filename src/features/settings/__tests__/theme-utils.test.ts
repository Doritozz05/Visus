import { describe, it, expect } from "vitest";
import { hexToHsl, resolveColor, COLOR_PRESETS } from "../../../lib/color-utils";
import type { CustomTheme } from "../../../core/entities/settings";

describe("Theme Colors and Preset Resolving Utilities", () => {
  describe("resolveColor", () => {
    it("should resolve standard color presets to their hex code", () => {
      expect(resolveColor("violet")).toBe(COLOR_PRESETS.violet);
      expect(resolveColor("indigo")).toBe(COLOR_PRESETS.indigo);
      expect(resolveColor("emerald")).toBe(COLOR_PRESETS.emerald);
    });

    it("should return the original string if it is not a preset", () => {
      expect(resolveColor("#ff5500")).toBe("#ff5500");
      expect(resolveColor("rgb(255, 255, 255)")).toBe("rgb(255, 255, 255)");
    });

    it("should return white fallback for empty strings", () => {
      expect(resolveColor("")).toBe("#ffffff");
    });
  });

  describe("hexToHsl", () => {
    it("should convert hex colors to valid HSL strings used by Tailwind", () => {
      // Pure red: #ff0000 => 0 100% 50%
      const redResult = hexToHsl("#ff0000");
      expect(redResult.h).toBe(0);
      expect(redResult.s).toBe(100);
      expect(redResult.l).toBe(50);
      expect(redResult.stringVal).toBe("0 100% 50%");

      // Pure black: #000000
      const blackResult = hexToHsl("#000000");
      expect(blackResult.l).toBe(0);
      expect(blackResult.stringVal).toBe("0 0% 0%");

      // Pure white: #ffffff
      const whiteResult = hexToHsl("#ffffff");
      expect(whiteResult.l).toBe(100);
      expect(whiteResult.stringVal).toBe("0 0% 100%");
    });

    it("should resolve preset color keys automatically inside hexToHsl", () => {
      const violetPresetResult = hexToHsl("violet");
      expect(violetPresetResult.stringVal).toBe(hexToHsl(COLOR_PRESETS.violet).stringVal);
    });
  });

  describe("CustomTheme Schema Constraints", () => {
    it("should support custom background types and materials", () => {
      const mockTheme: CustomTheme = {
        id: "theme-custom-test",
        name: "Test Glass Dark",
        isDark: true,
        background: "#0d0e15",
        foreground: "#f8f8f2",
        border: "#282a36",
        cardBackground: "#1d1f27",
        cardForeground: "#f8f8f2",
        cardBorder: "#282a36",
        cardRadius: "8px",
        cardShadow: "glow",
        accent: "#ff79c6",
        accentForeground: "#0d0e15",
        muted: "#282a36",
        mutedForeground: "#6272a4",
        overrideSidebar: true,
        sidebarBackground: "#0d0e15",
        overrideReader: false,
        bgType: "image",
        bgImageUrl: "data:image/jpeg;base64,...",
        bgImageBlur: 8,
        bgImageOpacity: 0.5,
        glassmorphism: {
          enabled: true,
          blur: 16,
          opacity: 0.3,
          borderOpacity: 0.05
        }
      };

      expect(mockTheme.isDark).toBe(true);
      expect(mockTheme.bgType).toBe("image");
      expect(mockTheme.glassmorphism?.enabled).toBe(true);
      expect(mockTheme.glassmorphism?.blur).toBe(16);
      expect(mockTheme.overrideSidebar).toBe(true);
      expect(mockTheme.sidebarBackground).toBe("#0d0e15");
    });
  });
});
