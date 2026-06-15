import { describe, it, expect, vi } from "vitest";
import { cn, calculateFileHash, hashString } from "../utils";

describe("cn", () => {
  it("merges classes correctly", () => {
    expect(cn("a", "b")).toBe("a b");
    expect(cn("a", { b: true, c: false })).toBe("a b");
    expect(cn("p-4", "p-2")).toBe("p-2"); // tailwind-merge in action
  });
});

describe("hashing functions", () => {
  it("calculates file hash correctly", async () => {
    const content = "hello world";
    const blob = new Blob([content], { type: "text/plain" });
    const hash = await calculateFileHash(blob);
    expect(hash).toHaveLength(64);
    expect(typeof hash).toBe("string");
    
    const hash2 = await calculateFileHash(blob);
    expect(hash).toBe(hash2);
  });

  it("calculates string hash correctly", async () => {
    const text = "hello world";
    const hash = await hashString(text);
    expect(hash).toHaveLength(64);
    
    const hash2 = await hashString(text);
    expect(hash).toBe(hash2);
    
    const hashOther = await hashString("other");
    expect(hash).not.toBe(hashOther);
  });
});
