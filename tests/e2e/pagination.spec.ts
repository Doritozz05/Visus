import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Visus Pagination Stress Test - 3 EPUBs x 108 Combinations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to library and wait for it to load
    await page.goto('/library');
    await page.waitForLoadState('networkidle');

    // Define target EPUB files in the workspace
    const epubs = [
      { name: 'pg84-images-3.epub', titlePattern: /Frankenstein/i },
      { name: 'pg1513-images-3.epub', titlePattern: /Romeo/i },
      { name: 'pg2701-images-3.epub', titlePattern: /Moby/i },
    ];

    // Check if the books are already present in the library, otherwise upload them
    let needsUpload = false;
    for (const epub of epubs) {
      const cardCount = await page.locator('.bg-card', { has: page.locator('h3', { hasText: epub.titlePattern }) }).count();
      if (cardCount === 0) {
        needsUpload = true;
        break;
      }
    }

    if (needsUpload) {
      console.log('Target EPUBs not found in library. Uploading them...');
      const fileInput = page.locator('input[type="file"]');
      const paths = epubs.map((epub) => path.resolve(process.cwd(), 'epub', epub.name));

      // Assert files exist locally before setting them
      for (const p of paths) {
        if (!fs.existsSync(p)) {
          throw new Error(`Required EPUB file does not exist: ${p}`);
        }
      }

      await fileInput.setInputFiles(paths);

      // Wait for all 3 books to appear in the library list
      for (const epub of epubs) {
        await expect(
          page.locator('.bg-card', { has: page.locator('h3', { hasText: epub.titlePattern }) }).first()
        ).toBeVisible({ timeout: 20000 });
      }
      console.log('EPUB files uploaded and parsed successfully.');
    }
  });

  const fontFamilies = ['inter', 'atkinson', 'dyslexic', 'serif'];
  const fontSizes = [14, 20, 26]; // Min, Mid, Max
  const densities = [200, 350, 500]; // Min, Mid, Max

  const testBooks = [
    { titlePattern: /Frankenstein/i, label: 'Frankenstein' },
    { titlePattern: /Romeo/i, label: 'Romeo and Juliet' },
    { titlePattern: /Moby/i, label: 'Moby Dick' },
  ];

  for (let bookIndex = 0; bookIndex < testBooks.length; bookIndex++) {
    const book = testBooks[bookIndex];
    test(`Pagination Traversal Validation for: ${book.label}`, async ({ page }) => {
      // Find the book card and open the reader
      const bookCard = page.locator('.bg-card', { has: page.locator('h3', { hasText: book.titlePattern }) }).first();
      await bookCard.locator('button:has-text("Read Book")').click();
      await page.waitForURL('**/reader');
      await page.waitForSelector('.epub-content');

      // Test combinations
      let comboIndex = 0;
      const totalCombos = fontFamilies.length * fontSizes.length * densities.length;

      for (const fontFamily of fontFamilies) {
        for (const fontSize of fontSizes) {
          for (const density of densities) {
            comboIndex++;
            console.log(`[Book ${bookIndex + 1}/${testBooks.length}] [Combo ${comboIndex}/${totalCombos}] Testing [${book.label}]: Font=${fontFamily}, Size=${fontSize}px, Density=${density}w`);

            // Open settings drawer
            await page.getByTestId('desktop-settings-button').click();
            await page.waitForSelector('[data-testid="settings-close-button"]');

            // Apply typeface family
            await page.getByTestId('font-selector-trigger').click();
            await page.getByTestId(`font-family-button-${fontFamily}`).click();

            // Apply font size
            await page.getByTestId('reader-font-size').evaluate((el: HTMLInputElement, val) => {
              el.value = String(val);
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }, fontSize);

            // Apply density (words per page)
            await page.getByTestId('reader-words-per-page').evaluate((el: HTMLInputElement, val) => {
              el.value = String(val);
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }, density);

            // Close drawer
            await page.getByTestId('settings-close-button').click();
            await expect(page.getByTestId('settings-close-button')).toBeHidden();

            // Short sleep to allow reflow layout to stabilize
            await page.waitForTimeout(400);

            // Verify pagination navigation
            const pageIndicator = page.getByText(/Page \d+ of \d+/).first();
            await expect(pageIndicator).toBeVisible();

            const text = await pageIndicator.textContent();
            const match = text?.match(/Page (\d+) of (\d+)/);
            if (!match) {
              throw new Error(`Invalid page indicator text: ${text}`);
            }

            let startPageNum = parseInt(match[1], 10);
            const totalPages = parseInt(match[2], 10);

            // Traversal check: Click Next Page 5 times (or up to totalPages)
            // and verify page number increments exactly by 1 each time.
            const nextButton = page.getByTestId('next-page-button');
            
            let clicks = 0;
            const maxClicks = Math.min(5, totalPages - startPageNum);

            for (let i = 0; i < maxClicks; i++) {
              const buttonText = await nextButton.textContent();
              if (await nextButton.isDisabled() || buttonText?.includes("Next Chapter") || buttonText?.includes("Complete Book")) {
                break;
              }

              await nextButton.click();
              clicks++;

              const expectedPage = startPageNum + clicks;
              await expect(async () => {
                const updatedText = await pageIndicator.textContent();
                const updatedMatch = updatedText?.match(/Page (\d+) of (\d+)/);
                if (!updatedMatch) {
                  throw new Error(`Invalid page indicator text on step ${i}: ${updatedText}`);
                }
                const currentPage = parseInt(updatedMatch[1], 10);
                expect(currentPage).toBe(expectedPage);
              }).toPass({ timeout: 5000 });
            }

            console.log(`Combo Verified: Font=${fontFamily}, Size=${fontSize}px, Density=${density}w successfully moved forward ${clicks} pages.`);
          }
        }
      }

      // Return back to library for next tests
      await page.goto('/library');
    });
  }
});
