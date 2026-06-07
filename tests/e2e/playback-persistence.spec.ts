import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Visus Playback and Progress Persistence E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to library
    await page.goto('/library');
    
    // Wait for the loading spinner/hydration to complete
    await page.locator('text=Calibrating visual elements...').waitFor({ state: 'detached', timeout: 20000 });

    // Seed library if empty by checking first book card
    const cardCount = await page.locator('.bg-card:has(h3)').count();
    if (cardCount === 0) {
      console.log('Seeding library with test EPUB...');
      const fileInput = page.locator('input[type="file"]');
      const targetEpub = path.resolve(process.cwd(), 'epub', 'pg2701-images-3.epub'); // Moby Dick
      
      if (!fs.existsSync(targetEpub)) {
        throw new Error(`Required EPUB file does not exist: ${targetEpub}`);
      }

      await fileInput.setInputFiles([targetEpub]);
      
      // Wait for books to load
      await expect(page.locator('.bg-card:has(h3)').first()).toBeVisible({ timeout: 20000 });
    }
  });

  test('should persist reading page progress when navigating away and back', async ({ page }) => {
    // 1. Select the first active book
    const firstBookCard = page.locator('.bg-card:has(h3)').first();
    const bookTitle = await firstBookCard.locator('h3').textContent();
    console.log(`Testing page persistence for book: ${bookTitle}`);

    const readButton = firstBookCard.locator('button', { hasText: 'Read book' });
    await expect(readButton).toBeVisible();
    await readButton.click();
    await page.waitForURL('**/reader');
    await page.waitForSelector('.epub-content');

    // 2. Wait for rendering and read current page indicator
    const pageIndicator = page.getByText(/Page \d+ of \d+/).first();
    await expect(pageIndicator).toBeVisible();
    
    let text = await pageIndicator.textContent();
    let match = text?.match(/Page (\d+) of (\d+)/);
    expect(match).toBeTruthy();
    let startPageNum = parseInt(match![1], 10);
    const totalPages = parseInt(match![2], 10);

    // 3. Navigate forward 2 pages if possible
    const nextButton = page.getByTestId('next-page-button');
    if (startPageNum < totalPages - 1) {
      await nextButton.click();
      await page.waitForTimeout(500);
      
      let expectedPage = startPageNum + 1;
      await expect(async () => {
        const t = await pageIndicator.textContent();
        const m = t?.match(/Page (\d+) of (\d+)/);
        expect(parseInt(m![1], 10)).toBe(expectedPage);
      }).toPass({ timeout: 5000 });

      // Click next page again
      await nextButton.click();
      await page.waitForTimeout(500);
      
      expectedPage = startPageNum + 2;
      await expect(async () => {
        const t = await pageIndicator.textContent();
        const m = t?.match(/Page (\d+) of (\d+)/);
        expect(parseInt(m![1], 10)).toBe(expectedPage);
      }).toPass({ timeout: 5000 });

      startPageNum = expectedPage;
    }

    // 4. Navigate away to the library page (this triggers hook unmount / autosave)
    await page.locator('a[href="/library"]').first().click();
    await page.waitForURL('**/library');
    await page.waitForLoadState('networkidle');

    // 5. Navigate back to the reader page
    await page.locator('.bg-card:has(h3)').first().locator('button', { hasText: 'Read book' }).click();
    await page.waitForURL('**/reader');
    await page.waitForSelector('.epub-content');

    // 6. Verify the page indicator restored exactly the last read page position!
    const restoredIndicator = page.getByText(/Page \d+ of \d+/).first();
    await expect(restoredIndicator).toBeVisible();
    
    await expect(async () => {
      const restoredText = await restoredIndicator.textContent();
      const restoredMatch = restoredText?.match(/Page (\d+) of (\d+)/);
      expect(parseInt(restoredMatch![1], 10)).toBe(startPageNum);
    }).toPass({ timeout: 5000 });
  });

  test('should handle bookmark creation, navigation, and deletion', async ({ page }) => {
    // Open reader
    await page.locator('.bg-card:has(h3)').first().locator('button', { hasText: 'Read book' }).click();
    await page.waitForURL('**/reader');
    await page.waitForSelector('.epub-content');

    // Click bookmark corner ribbon
    const bookmarkCorner = page.locator('button[title*="bookmark"]').first();
    await expect(bookmarkCorner).toBeVisible();
    await bookmarkCorner.click();

    // Fill bookmark form in dropdown popup
    const nameInput = page.locator('#bookmark-name-input').first();
    await expect(nameInput).toBeVisible();
    
    const testBookmarkName = `E2E Bookmark - ${Date.now()}`;
    await nameInput.fill(testBookmarkName);
    
    // Save bookmark
    await page.locator('button', { hasText: 'Save' }).first().click();
    await page.waitForTimeout(500);

    // Verify bookmark exists in TOC dropdown
    const chapterBadge = page.getByTitle('Open table of contents / chapter index').first();
    await expect(chapterBadge).toBeVisible();
    await chapterBadge.click();

    // Click Bookmarks tab in TOC dropdown
    const bookmarksTab = page.locator('button', { hasText: 'Bookmarks' }).first();
    await expect(bookmarksTab).toBeVisible();
    await bookmarksTab.click();

    // Verify the test bookmark is listed
    const bookmarkItem = page.locator('span', { hasText: testBookmarkName }).first();
    await expect(bookmarkItem).toBeVisible();

    // Delete bookmark
    const deleteButton = page.locator('button[title="Delete bookmark"]').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Verify bookmark is removed from index list
    await expect(bookmarkItem).toBeHidden();
  });

  test('should toggle reading modes and display active player controls', async ({ page }) => {
    // Open reader
    await page.locator('.bg-card:has(h3)').first().locator('button', { hasText: 'Read book' }).click();
    await page.waitForURL('**/reader');
    await page.waitForSelector('.epub-content');

    // Switch to RSVP mode
    const rsvpModeButton = page.locator('button', { hasText: 'RSVP' }).first();
    await expect(rsvpModeButton).toBeVisible();
    await rsvpModeButton.click();

    // Verify player control bar appears
    const playerBar = page.locator('.material-symbols-outlined', { hasText: 'play_arrow' }).first();
    await expect(playerBar).toBeVisible();

    // Switch to Cluster mode
    const clusterModeButton = page.locator('button', { hasText: 'Cluster' }).first();
    await expect(clusterModeButton).toBeVisible();
    await clusterModeButton.click();

    // Verify player control bar is still present
    await expect(playerBar).toBeVisible();

    // Switch back to Pages (normal) mode
    const pagesModeButton = page.locator('button', { hasText: 'Pages' }).first();
    await expect(pagesModeButton).toBeVisible();
    await pagesModeButton.click();

    // Verify player control bar is hidden
    await expect(playerBar).toBeHidden();
  });
});
