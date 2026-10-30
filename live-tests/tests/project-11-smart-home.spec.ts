import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-11: smart-home-gesture-control-dashboard", () => {
  const config = getProjectConfig("project-11");

  test("Smoke Test: page loads with 200, brand title visible @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const brand = page.locator(".brand, .hero-title").first();
    await expect(brand).toContainText(/SmartHome|Hand Signs/i);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Interaction Test: toggle theme and navigate to devices section", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Theme toggle
    const themeBtn = page.locator("#themeToggle");
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    await page.waitForTimeout(300);

    // 2. Click devices tab/link
    const devicesLink = page.locator("a[data-link='devices'], button[data-link='devices']").first();
    await expect(devicesLink).toBeVisible();
    await devicesLink.click();
    await page.waitForTimeout(500);

    // Verify devices section is active or visible
    const devicesSec = page.locator("#devices");
    await expect(devicesSec).toBeAttached();
  });
});
