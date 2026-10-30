import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-07: mental-wellness-chat-and-meditation-platform", () => {
  const config = getProjectConfig("project-07");

  test("Smoke Test: page loads with 200, hero header visible @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const heading = page.locator(".hero-title, h1").first();
    await expect(heading).toContainText(/Emotional Wellness|Companion|Mental/i);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Interaction Test: toggle theme and toggle notifications panel", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Toggle theme
    const themeBtn = page.locator("#theme-toggle");
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    await page.waitForTimeout(300);

    // 2. Toggle notifications
    const notifBtn = page.locator("#notif-toggle");
    await expect(notifBtn).toBeVisible();
    await notifBtn.click();
    const notifPanel = page.locator("#notifications-panel");
    await expect(notifPanel).toBeAttached();
  });
});
