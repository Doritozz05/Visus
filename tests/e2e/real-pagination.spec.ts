import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Configure test suite to use a desktop viewport of 1920x1080
test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Visus Real Pagination E2E Validation - 1920x1080', () => {
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

  const testBooks = [
    { titlePattern: /Frankenstein/i, label: 'Frankenstein' },
    { titlePattern: /Romeo/i, label: 'Romeo and Juliet' },
    { titlePattern: /Moby/i, label: 'Moby Dick' },
  ];

  // We will run tests for two configurations:
  // 1. Problematic setup: 26px font size, 200 words density (low words per page, high wrapping)
  // 2. Standard setup: 16px font size, 300 words density
  const testConfigs = [
    { label: 'Problematic Configuration (26px, 200w)', fontSize: 26, density: 200, fontFamily: 'serif' },
    { label: 'Standard Configuration (16px, 300w)', fontSize: 16, density: 300, fontFamily: 'serif' },
  ];

  for (const book of testBooks) {
    for (const config of testConfigs) {
      test(`Page-by-page traversal for: ${book.label} under ${config.label}`, async ({ page }) => {
        // Open the reader for this book
        const bookCard = page.locator('.bg-card', { has: page.locator('h3', { hasText: book.titlePattern }) }).first();
        await bookCard.locator('button:has-text("Read Book")').click();
        await page.waitForURL('**/reader');
        await page.waitForSelector('.epub-content');

        console.log(`Setting config for [${book.label}]: Font=${config.fontFamily}, Size=${config.fontSize}px, Density=${config.density}w`);

        // Open settings drawer
        await page.getByTestId('desktop-settings-button').click();
        await page.waitForSelector('[data-testid="settings-close-button"]');

        // Apply typeface family
        await page.getByTestId(`font-family-button-${config.fontFamily}`).click();

        // Apply font size
        await page.getByTestId('reader-font-size').evaluate((el: HTMLInputElement, val) => {
          el.value = String(val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, config.fontSize);

        // Apply density (words per page)
        await page.getByTestId('reader-words-per-page').evaluate((el: HTMLInputElement, val) => {
          el.value = String(val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, config.density);

        // Close drawer
        await page.getByTestId('settings-close-button').click();
        await expect(page.getByTestId('settings-close-button')).toBeHidden();

        // Wait for reflow layout to stabilize
        await page.waitForTimeout(1000);

        // Read page indicator
        const pageIndicator = page.getByText(/Page \d+ of \d+/).first();
        await expect(pageIndicator).toBeVisible();

        const text = await pageIndicator.textContent();
        const match = text?.match(/Page (\d+) of (\d+)/);
        if (!match) {
          throw new Error(`Invalid page indicator text: ${text}`);
        }

        let startPageNum = parseInt(match[1], 10);
        const totalPages = parseInt(match[2], 10);
        console.log(`[${book.label}] starts at page ${startPageNum} of ${totalPages}`);

        const nextButton = page.getByTestId('next-page-button');
        let currentPageNum = startPageNum;
        let clicks = 0;

        // Traverse page-by-page through the first chapter
        while (true) {
          const buttonText = await nextButton.textContent();
          if (await nextButton.isDisabled() || buttonText?.includes("Next Chapter") || buttonText?.includes("Complete Book")) {
            console.log(`[${book.label}] Reached chapter/book end at page ${currentPageNum} after ${clicks} page turns.`);
            break;
          }

          // Visual check of button visibility and click
          await expect(nextButton).toBeVisible();
          await nextButton.click();
          clicks++;
          currentPageNum++;

          // Verify that the page indicator has updated exactly to the expected page number
          await expect(async () => {
            const updatedText = await pageIndicator.textContent();
            const updatedMatch = updatedText?.match(/Page (\d+) of (\d+)/);
            if (!updatedMatch) {
              throw new Error(`Invalid page indicator text: ${updatedText}`);
            }
            const displayedPage = parseInt(updatedMatch[1], 10);
            expect(displayedPage).toBe(currentPageNum);
          }).toPass({ timeout: 5000 });

          console.log(`[${book.label}] Page transition verified: ${currentPageNum - 1} -> ${currentPageNum}`);
        }

        // Return back to library for next tests
        await page.goto('/library');
        await page.waitForLoadState('networkidle');
      });
    }
  }
});
