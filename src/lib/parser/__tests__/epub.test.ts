import { describe, it, expect } from "vitest";
import { getGeneralEpubGenres, normalizeEpubSubject } from "../epub";

describe("EPUB subject normalization", () => {
  it("should keep only the broad genre from Library of Congress subject subdivisions", () => {
    expect(normalizeEpubSubject("Whaling -- Fiction")).toBe("Fiction");
    expect(normalizeEpubSubject("Ship captains -- Fiction")).toBe("Fiction");
    expect(normalizeEpubSubject("Juliet (Fictitious character) -- Drama")).toBe("Drama");
  });

  it("should preserve already-general subjects and deduplicate them", () => {
    expect(normalizeEpubSubject("Science fiction")).toBe("Science fiction");
    expect(normalizeEpubSubject("Tragedies (Drama)")).toBe("Drama");

    expect(
      getGeneralEpubGenres([
        "Whaling -- Fiction",
        "Ship captains -- Fiction",
        "Science fiction",
        "Tragedies (Drama)",
        "science fiction",
      ])
    ).toEqual(["Fiction", "Science fiction", "Drama"]);
  });
});
