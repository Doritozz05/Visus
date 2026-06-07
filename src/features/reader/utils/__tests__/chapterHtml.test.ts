import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { prepareChapterHtml } from "../chapterHtml";

describe("prepareChapterHtml utility", () => {
  beforeAll(() => {
    // Stub global window so typeof window !== "undefined"
    vi.stubGlobal("window", {});

    class MockElement {
      tagName: string;
      textContent: string = "";
      children: MockElement[] = [];
      parent: MockElement | null = null;
      attributes: Record<string, string> = {};

      constructor(tagName: string, textContent: string = "") {
        this.tagName = tagName.toUpperCase();
        this.textContent = textContent;
      }

      setAttribute(name: string, value: string) {
        this.attributes[name] = value;
      }

      getAttribute(name: string): string | null {
        return this.attributes[name] || null;
      }

      remove() {
        if (this.parent) {
          this.parent.children = this.parent.children.filter((c) => c !== this);
        }
      }

      querySelector(selector: string): MockElement | null {
        if (selector.includes("img") && this.tagName === "IMG") {
          return this;
        }
        for (const child of this.children) {
          const found: MockElement | null = child.querySelector(selector);
          if (found) return found;
        }
        return null;
      }

      querySelectorAll(selector: string): MockElement[] {
        const results: MockElement[] = [];
        const recurse = (node: MockElement) => {
          const tag = node.tagName.toLowerCase();
          const isMatch = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "pre", "td", "div", "section"].includes(tag);
          if (isMatch) {
            results.push(node);
          }
          for (const child of node.children) {
            recurse(child);
          }
        };
        for (const child of this.children) {
          recurse(child);
        }
        return results;
      }

      get innerHTML(): string {
        return this.children.map((child) => child.outerHTML).join("");
      }

      get outerHTML(): string {
        const tag = this.tagName.toLowerCase();
        const attrsStr = Object.entries(this.attributes)
          .map(([k, v]) => ` ${k}="${v}"`)
          .join("");
        if (tag === "br") {
          return `<br${attrsStr} />`;
        }
        if (tag === "img") {
          return `<img${attrsStr} />`;
        }
        const childrenHtml = this.children.length > 0 
          ? this.innerHTML 
          : this.textContent;
        return `<${tag}${attrsStr}>${childrenHtml}</${tag}>`;
      }
    }

    function parseHtmlToMockTree(html: string): MockElement {
      const root = new MockElement("div");
      let current: MockElement = root;

      const tagOrTextRegex = /(<\/?[a-zA-Z0-9]+[^>]*>|[^<]+)/g;
      let match;
      while ((match = tagOrTextRegex.exec(html)) !== null) {
        const token = match[0];
        if (token.startsWith("</")) {
          if (current.parent) {
            current = current.parent;
          }
        } else if (token.startsWith("<")) {
          const tagNameMatch = token.match(/<([a-zA-Z0-9]+)/);
          if (tagNameMatch) {
            const tagName = tagNameMatch[1];
            const child = new MockElement(tagName);
            const attrRegex = /([a-zA-Z0-9-]+)="([^"]*)"/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(token)) !== null) {
              child.setAttribute(attrMatch[1], attrMatch[2]);
            }
            child.parent = current;
            current.children.push(child);
            if (!token.endsWith("/>") && tagName.toLowerCase() !== "img" && tagName.toLowerCase() !== "br") {
              current = child;
            }
          }
        } else {
          const text = token.trim();
          if (text) {
            current.textContent = token;
          }
        }
      }

      return root;
    }

    class MockDOMParser {
      parseFromString(html: string) {
        const root = parseHtmlToMockTree(html);
        return {
          body: {
            firstElementChild: root.children[0] || null,
          },
        };
      }
    }

    vi.stubGlobal("DOMParser", MockDOMParser);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("should convert raw plain text to HTML paragraph blocks with word indices", () => {
    const chapter = {
      title: "Chapter 1",
      content: "Hello world. This is test content.",
      index: 0,
    };

    const result = prepareChapterHtml(chapter);
    expect(result).toContain('class="mb-4 text-justify leading-relaxed"');
    // Because we stubbed window, tagHtmlBlocksWithWordIndices will call querySelectorAll and tag it
    expect(result).toContain("data-start-word-idx");
    expect(result).toContain("Hello world.");
  });

  it("should use pre-existing htmlContent if provided", () => {
    const chapter = {
      title: "Chapter 2",
      content: "",
      htmlContent: "<p>Preexisting HTML</p>",
      index: 1,
    };

    const result = prepareChapterHtml(chapter);
    expect(result).toContain("<p");
    expect(result).toContain("Preexisting HTML");
  });

  it("should clean trailing empty elements safely", () => {
    const chapter = {
      title: "Chapter 3",
      content: "",
      htmlContent: "<p>Main body</p><p></p>",
      index: 2,
    };

    const result = prepareChapterHtml(chapter);
    expect(result).not.toContain("<p></p>");
    expect(result).toContain("Main body");
  });
});
