import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Library Management', () => {
  test('User can upload a book, open it in the reader, and delete it', async ({ page }) => {
    await page.goto('/library');
    
    // Upload book
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("Browse files")');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.resolve(process.cwd(), 'epub', 'z.epub'));

    // Wait for book card
    const bookCard = page.locator('.bg-card', { hasText: 'Moby' }).first();
    await expect(bookCard).toBeVisible({ timeout: 20000 });

    // Open Reader
    await bookCard.locator('button:has-text("Read book")').click();
    await expect(page).toHaveURL(/\/reader/);

    // Delete
    await page.goto('/library');
    await bookCard.locator('button[title="Delete book"]').click();
    await page.click('button:has-text("Delete")');
    
    await expect(bookCard).toBeHidden({ timeout: 10000 });
  });
});

