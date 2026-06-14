import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Visus Sentence Casing Validation', () => {
  test('home page casing check', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify page headings and links are in sentence case
    const mainHeading = page.getByRole('heading', { name: 'Visus', exact: true });
    await expect(mainHeading).toBeVisible();

    const subTitle = page.locator('h3').first();
    await expect(subTitle).toHaveText('Interactive prototype screens (Visus Reader Pro)');

    const links = page.locator('a');
    const linkTexts = await links.allTextContents();

    // Check key link buttons with case-insensitive matches
    const performanceLink = linkTexts.find(t => t.toLowerCase().includes('performance'));
    expect(performanceLink).toContain('Performance dashboard');

    const readingRoomLink = linkTexts.find(t => t.toLowerCase().includes('reading'));
    expect(readingRoomLink).toContain('Reading room');

    const libraryLink = linkTexts.find(t => t.toLowerCase().includes('library'));
    expect(libraryLink).toContain('Library management');

    const settingsLink = linkTexts.find(t => t.toLowerCase().includes('settings'));
    expect(settingsLink).toContain('Workspace settings');
  });

  test('library page casing check', async ({ page }) => {
    await page.goto('/library');

    // Wait for the loading spinner/hydration to complete
    await page.locator('text=Calibrating visual elements...').waitFor({ state: 'detached', timeout: 20000 });

    // Seed library if empty to ensure filter elements and stats are visible
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

    // Header casing (target the specific Library page title heading)
    const pageHeader = page.getByRole('heading', { name: 'Library' });
    await expect(pageHeader).toBeVisible();

    // Bento stats casing
    const statsLabel = page.getByText(/Goal|goal/).first();
    await expect(statsLabel).toContainText('Yearly goal');

    // Buttons and tabs casing
    const activeTab = page.locator('button', { hasText: 'Active' });
    await expect(activeTab).toBeVisible();

    const addManualButton = page.locator('button[title*="Add book"]');
    await expect(addManualButton).toBeVisible();
    const titleAttr = await addManualButton.getAttribute('title');
    expect(titleAttr).toBe('Add book manually');

    const filterLabel = page.getByText(/Filter by/);
    await expect(filterLabel).toContainText('Filter by tag:');
  });

  test('settings page casing check', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Settings Header
    const configHeading = page.locator('h2', { hasText: 'Configuration' });
    await expect(configHeading).toBeVisible();

    // Reset button
    const resetButton = page.locator('button', { hasText: 'Reset defaults' });
    await expect(resetButton).toBeVisible();

    // Tabs
    const generalTab = page.locator('button', { hasText: 'General & UI' });
    await expect(generalTab).toBeVisible();

    const rsvpTab = page.locator('button', { hasText: 'RSVP' });
    await expect(rsvpTab).toBeVisible();

    const clusterTab = page.locator('button', { hasText: 'Cluster' });
    await expect(clusterTab).toBeVisible();

    const accountTab = page.locator('button', { hasText: 'Account & Sync' });
    await expect(accountTab).toBeVisible();
    await accountTab.click();

    // Profile section
    const profileHeading = page.locator('h3', { hasText: 'Local profile' });
    await expect(profileHeading).toBeVisible();

    const guestReader = page.locator('h4', { hasText: 'Guest reader' });
    await expect(guestReader).toBeVisible();

    const loginButton = page.locator('a, button', { hasText: 'Login / register' });
    await expect(loginButton).toBeVisible();

    // Cloud storage section
    const storageHeading = page.locator('h3', { hasText: 'Storage sync' });
    await expect(storageHeading).toBeVisible();

    const syncStatusLabel = page.locator('span', { hasText: 'Cloud sync status' });
    await expect(syncStatusLabel).toBeVisible();

    const forceSyncButton = page.locator('button', { hasText: 'Synchronize library now' });
    await expect(forceSyncButton).toBeVisible();
  });
});
