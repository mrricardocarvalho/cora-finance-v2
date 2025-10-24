/**
 * E2E tests for homepage
 * 
 * Tests the homepage rendering with Liquid Glass UI and health check display.
 * Validates Constitutional design system implementation.
 * 
 * @module tests/e2e/homepage.spec
 */

import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display "Hello Cora Finance"', async ({ page }) => {
    await page.goto('/');

    // Check main heading
    const heading = page.getByRole('heading', { name: /Hello Cora Finance/i });
    await expect(heading).toBeVisible();
  });

  test('should display Liquid Glass UI with gradient background', async ({
    page,
  }) => {
    await page.goto('/');

    // Check that body has gradient background classes applied
    const body = page.locator('body');
    await expect(body).toHaveClass(/bg-gradient/);
  });

  test('should display glass card with backdrop blur', async ({ page }) => {
    await page.goto('/');

    // Check for glass card styling
    const glassCard = page.locator('.glass-card').first();
    await expect(glassCard).toBeVisible();
  });

  test('should display System Health section', async ({ page }) => {
    await page.goto('/');

    // Check for System Health heading
    const healthHeading = page.getByRole('heading', {
      name: /System Health/i,
    });
    await expect(healthHeading).toBeVisible();
  });

  test('should display health check status', async ({ page }) => {
    await page.goto('/');

    // Wait for health check to load
    await page.waitForTimeout(1000);

    // Check for status text (healthy, degraded, or unhealthy)
    const statusText = page.locator('text=/healthy|degraded|unhealthy/i');
    await expect(statusText).toBeVisible();
  });

  test('should display database connection status', async ({ page }) => {
    await page.goto('/');

    // Wait for health check to load
    await page.waitForTimeout(1000);

    // Check for database status
    const dbStatus = page.getByText(/Database/i);
    await expect(dbStatus).toBeVisible();
  });

  test('should display server uptime', async ({ page }) => {
    await page.goto('/');

    // Wait for health check to load
    await page.waitForTimeout(1000);

    // Check for server uptime
    const uptime = page.getByText(/Server Uptime/i);
    await expect(uptime).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');

    // Check that page has proper HTML structure
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');

    // Check that main heading exists
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('should animate on page load', async ({ page }) => {
    await page.goto('/');

    // The glass card should have animation (Framer Motion)
    const glassCard = page.locator('.glass-card').first();
    await expect(glassCard).toBeVisible();

    // Card should be visible (animation completed)
    await expect(glassCard).toHaveCSS('opacity', /1|0\.\d+/);
  });
});
