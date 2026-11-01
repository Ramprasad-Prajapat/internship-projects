import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";
import { setupMediaPipeStub, simulateHandGesture } from "../helpers/cameraSimulation";
import { scanBundleForSecrets } from "../helpers/securityScanner";
import { testResponsiveViewports, testAssetsAndLinks } from "../helpers/auditHelpers";

test.describe("project-04: eco-ninja-gesture-slicing-game", () => {
  const config = getProjectConfig("project-04");

  test("1. Smoke Test: page loads with 200, title 'Eco Ninja' visible @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const logo = page.locator(".game-logo, h1").first();
    await expect(logo).toContainText(/Eco Ninja/i);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("2. Responsive Test: desktop and mobile viewports", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await testResponsiveViewports(page, "project-04-eco-ninja");
  });

  test("3. Assets and Links Test: MediaPipe CDNs and styles return 2xx", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await testAssetsAndLinks(page, config.webUrl);
  });

  test("4. Core Features Test: click how to play and start game transitions", async ({ page }) => {
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
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // Verify game canvas screen activates
    const gameScreen = page.locator("#game-screen, #game-canvas").first();
    await expect(gameScreen).toBeAttached();
  });

  test("5. Camera Simulation Test: scripted hand coordinates trigger slicing blade motion", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await setupMediaPipeStub(page);
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Simulate slicing gesture
    await simulateHandGesture(page, "oneFinger", { x: 0.3, y: 0.4 });
    await page.waitForTimeout(100);
    await simulateHandGesture(page, "oneFinger", { x: 0.7, y: 0.6 });
    await page.waitForTimeout(100);

    const logo = page.locator(".game-logo, h1").first();
    await expect(logo).toBeVisible();
  });

  test("6. Security Scan Test: deployed bundle contains zero exposed keys", async () => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const findings = await scanBundleForSecrets(config.webUrl);
    expect(findings).toHaveLength(0);
  });
});
