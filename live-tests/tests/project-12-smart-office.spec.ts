import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-12: smart-office-voice-dashboard", () => {
  const config = getProjectConfig("project-12");

  test("Smoke Test: page loads with 200, brand title visible, no crash without speech API @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const brand = page.locator(".brand-name, h1, body").first();
    await expect(brand).toBeVisible();

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Interaction Test: switch to employees tab and meeting rooms tab via buttons", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Switch to employees tab
    const empBtn = page.locator("#btn-employees");
    await expect(empBtn).toBeVisible();
    await empBtn.click();
    await page.waitForTimeout(400);
    await expect(empBtn).toHaveClass(/active/);

    // 2. Switch to meeting rooms tab
    const roomsBtn = page.locator("#btn-meeting-rooms");
    await expect(roomsBtn).toBeVisible();
    await roomsBtn.click();
    await page.waitForTimeout(400);
    await expect(roomsBtn).toHaveClass(/active/);
  });
});
