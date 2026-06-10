import { describe, it, expect } from "vitest";
import { cleanTitle } from "../utils";

describe("cleanTitle", () => {
  it("should return normal strings unchanged", () => {
    expect(cleanTitle("The Great Gatsby")).toBe("The Great Gatsby");
  });

  it("should trim leading and trailing spaces", () => {
    expect(cleanTitle("   The Great Gatsby   ")).toBe("The Great Gatsby");
  });

  it("should collapse multiple contiguous spaces into a single space", () => {
    expect(cleanTitle("The   Great     Gatsby")).toBe("The Great Gatsby");
  });

  it("should handle tabs and newlines as spaces", () => {
    expect(cleanTitle("The\nGreat\tGatsby")).toBe("The Great Gatsby");
    expect(cleanTitle("  \n The \t Great \n\n Gatsby \t  ")).toBe("The Great Gatsby");
  });

  it("should return an empty string for empty or whitespace-only strings", () => {
    expect(cleanTitle("")).toBe("");
    expect(cleanTitle("   ")).toBe("");
    expect(cleanTitle("\n\t  ")).toBe("");
  });
});
