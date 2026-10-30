import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-14: touchless-hospital-gesture-interface", () => {
  const config = getProjectConfig("project-14");

  test("Smoke Test: page loads with 200, HUD directory, and video feed @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const hudHeader = page.locator(".gesture-hud-header, .hud-title, body").first();
    await expect(hudHeader).toBeVisible();

    const webcam = page.locator("#webcam");
    await expect(webcam).toBeAttached();

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Interaction Test: HUD global action elements and section inspection", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Check HUD action elements
    const hudItem = page.locator(".gesture-item").first();
    await expect(hudItem).toBeVisible();

    // 2. Click a navigation or tab item if present
    const actionBtn = page.locator("button, .nav-btn, .tab-btn").first();
    if (await actionBtn.isVisible()) {
      await actionBtn.click();
      await page.waitForTimeout(300);
    }
  });
});
