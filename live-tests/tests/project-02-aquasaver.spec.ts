import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-02: aquasaver-gesture-water-simulator", () => {
  const config = getProjectConfig("project-02");

  test("Smoke Test: page loads with 200, header, and no uncaught errors @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    await expect(page.locator(".header-tagline, .app-header, body").first()).toBeVisible();
    await page.waitForTimeout(1000);

    // Expect video element exists for camera tracking
    const webcam = page.locator("#webcam");
    await expect(webcam).toBeAttached();

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Interaction Test: toggle audio and open resource report modal", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Audio toggle action
    const audioBtn = page.locator("#btn-audio-toggle");
    await expect(audioBtn).toBeVisible();
    const initialText = await audioBtn.innerText();
    await audioBtn.click();
    const updatedText = await audioBtn.innerText();
    expect(updatedText).not.toEqual(initialText);

    // 2. Open water usage report modal and close it
    await page.evaluate(() => {
      if (typeof (window as any).showReport === "function") {
        (window as any).showReport();
      }
    });
    const reportModal = page.locator("#report-modal");
    await expect(reportModal).toHaveClass(/modal-open/);

    // Close modal via close button
    const closeBtn = page.locator("#report-modal .modal-close, #report-modal button:has-text('Close')").first();
    await closeBtn.click();
    await expect(reportModal).not.toHaveClass(/modal-open/);
  });
});
