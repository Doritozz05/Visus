import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('User can see registration confirmation after sign up', async ({ page }) => {
    // Navigate to registration
    await page.goto('/register');
    
    // Fill form
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', 'Password123!');
    await page.fill('input[id="confirm-password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Email registration shows the success confirmation view
    await expect(page.locator('h3:has-text("Check your inbox")')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('strong')).toContainText(email);
  });

  test('User gets an error with invalid login credentials', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    
    // Fill invalid credentials
    await page.fill('input[id="email"]', 'nonexistent@example.com');
    await page.fill('input[id="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Expecting error notification
    await expect(page.locator('text=Sign in failed')).toBeVisible({ timeout: 10000 });
  });
});

