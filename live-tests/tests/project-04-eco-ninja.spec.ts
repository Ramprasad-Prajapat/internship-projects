import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-04: eco-ninja-gesture-slicing-game", () => {
  const config = getProjectConfig("project-04");

  test("Smoke Test: page loads with 200, title 'Eco Ninja' visible @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const logo = page.locator(".game-logo, h1").first();
    await expect(logo).toContainText(/Eco Ninja/i);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Interaction Test: click how to play and start game transitions", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Click how to play / info button and close modal
    const howToBtn = page.locator("#btn-how-to-play");
    if (await howToBtn.isVisible()) {
      await howToBtn.click();
      await page.waitForTimeout(300);
      const closeBtn = page.locator("#btn-modal-close, #btn-modal-start").first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // 2. Click start game
    const startBtn = page.locator("#btn-start-game");
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Verify game canvas screen activates
    const gameScreen = page.locator("#game-screen, #game-canvas").first();
    await expect(gameScreen).toBeAttached();
  });
});
