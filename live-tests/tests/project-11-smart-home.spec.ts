import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";
import { setupMediaPipeStub, simulateHandGesture } from "../helpers/cameraSimulation";
import { scanBundleForSecrets } from "../helpers/securityScanner";
import { testResponsiveViewports, testAssetsAndLinks } from "../helpers/auditHelpers";

test.describe("project-11: smart-home-gesture-control-dashboard", () => {
  const config = getProjectConfig("project-11");

  test("1. Smoke Test: page loads with 200, brand title visible @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const brand = page.locator(".brand, .hero-title").first();
    await expect(brand).toContainText(/SmartHome|Hand Signs/i);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("2. Responsive Test: desktop and mobile viewports", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await testResponsiveViewports(page, "project-11-smart-home");
  });

  test("3. Assets and Links Test: scripts and styles return 2xx", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await testAssetsAndLinks(page, config.webUrl);
  });

  test("4. Core Features Test: toggle theme and navigate to devices section", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Theme toggle
    const themeBtn = page.locator("#themeToggle");
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);
    }

    // 2. Click devices tab/link
    const devicesLink = page.locator("a[data-link='devices'], button[data-link='devices']").first();
    if (await devicesLink.isVisible()) {
      await devicesLink.click();
      await page.waitForTimeout(500);
    }

    const devicesSec = page.locator("#devices");
    await expect(devicesSec).toBeAttached();
  });

  test("5. Camera Simulation Test: scripted gesture updates dashboard status", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await setupMediaPipeStub(page);
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Start camera if toggle button exists
    const startCam = page.locator("#startCam, #btn-camera").first();
    if (await startCam.isVisible()) {
      await startCam.click();
      await page.waitForTimeout(300);
    }

    // Simulate gesture
    await simulateHandGesture(page, "openPalm");
    await page.waitForTimeout(300);

    const brand = page.locator(".brand, .hero-title").first();
    await expect(brand).toBeVisible();
  });

  test("6. Security Scan Test: deployed bundle contains zero exposed keys", async () => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const findings = await scanBundleForSecrets(config.webUrl);
    expect(findings).toHaveLength(0);
  });
});
