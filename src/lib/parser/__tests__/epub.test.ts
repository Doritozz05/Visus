// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { parseEpub, getGeneralEpubGenres, normalizeEpubSubject } from "../epub";

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

describe("parseEpub workflow integration", () => {
  it("should successfully parse a valid mock EPUB file and return chapters", async () => {
    const zip = new JSZip();
    
    // 1. META-INF/container.xml
    zip.file("META-INF/container.xml", `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

    // 2. OEBPS/content.opf
    zip.file("OEBPS/content.opf", `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uuid_id" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Test Book Title</dc:title>
    <dc:creator>Test Author Name</dc:creator>
    <dc:description>A short description of the test book.</dc:description>
    <dc:publisher>Test Publisher</dc:publisher>
    <dc:language>en</dc:language>
    <dc:subject>Adventure -- Fiction</dc:subject>
  </metadata>
  <manifest>
    <item id="chap1" href="text/chap1.xhtml" media-type="application/xhtml+xml"/>
    <item id="chap2" href="text/chap2.xhtml" media-type="application/xhtml+xml"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="chap1"/>
    <itemref idref="chap2"/>
  </spine>
</package>`);

    // 3. OEBPS/toc.ncx
    zip.file("OEBPS/toc.ncx", `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel><text>Chapter 1</text></navLabel>
      <content src="text/chap1.xhtml"/>
    </navPoint>
    <navPoint id="navPoint-2" playOrder="2">
      <navLabel><text>Chapter 2</text></navLabel>
      <content src="text/chap2.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`);

    // 4. OEBPS/text/chap1.xhtml
    zip.file("OEBPS/text/chap1.xhtml", `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Chapter 1</title></head>
<body>
  <h1>Chapter 1 Header</h1>
  <p>This is the first chapter content.</p>
</body>
</html>`);

    // 5. OEBPS/text/chap2.xhtml
    zip.file("OEBPS/text/chap2.xhtml", `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Chapter 2</title></head>
<body>
  <h1>Chapter 2 Header</h1>
  <p>This is the second chapter content.</p>
</body>
</html>`);

    const arrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
    const parsed = await parseEpub(arrayBuffer);

    expect(parsed.title).toBe("Test Book Title");
    expect(parsed.author).toBe("Test Author Name");
    expect(parsed.description).toBe("A short description of the test book.");
    expect(parsed.publisher).toBe("Test Publisher");
    expect(parsed.language).toBe("en");
    expect(parsed.genres).toEqual(["Fiction"]);
    
    // Chapters checks
    expect(parsed.chapters).toHaveLength(2);
    expect(parsed.chapters[0].title).toBe("Chapter 1");
    expect(parsed.chapters[0].content).toContain("This is the first chapter content.");
    expect(parsed.chapters[1].title).toBe("Chapter 2");
    expect(parsed.chapters[1].content).toContain("This is the second chapter content.");
  });

  it("should throw error if container.xml is missing", async () => {
    const zip = new JSZip();
    const arrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
    await expect(parseEpub(arrayBuffer)).rejects.toThrow("Invalid EPUB: Missing META-INF/container.xml");
  });
});
