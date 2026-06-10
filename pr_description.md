Title: 🧹 chore: Replace any[] with BookChapter[] in chapter-fallback.ts

Description:
🎯 **What:** The `activeBookChapters` parameter in `buildChaptersData` (located in `src/lib/parser/chapter-fallback.ts`) was previously typed as `any[]`. This PR replaces `any[]` with the proper `BookChapter[]` interface.
💡 **Why:** Using `BookChapter[]` improves type safety, enhances readability, and aligns with the interface already used elsewhere in the parser domain. This ensures that the data structure being handled correctly matches the expected properties of a chapter.
✅ **Verification:** Verified by running unit tests (`npm run test`), type checking (`npm run typecheck`), and linting (`npm run lint`), ensuring all tests continue to pass and no type or lint errors are introduced. Formatted the file using prettier.
✨ **Result:** Improved maintainability and safer code by replacing `any` with the specific domain interface for chapters, without affecting existing functionality.
