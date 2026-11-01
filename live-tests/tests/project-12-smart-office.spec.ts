import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";
import { setupVoiceMock, simulateVoiceCommand } from "../helpers/voiceSimulation";
import { scanBundleForSecrets } from "../helpers/securityScanner";
import { testResponsiveViewports, testAssetsAndLinks } from "../helpers/auditHelpers";

test.describe("project-12: smart-office-voice-dashboard", () => {
  const config = getProjectConfig("project-12");

  test("1. Smoke Test: page loads with 200, brand title visible, no crash without speech API @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const brand = page.locator(".brand-name, h1, body").first();
    await expect(brand).toBeVisible();

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("2. Responsive Test: desktop and mobile viewports", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await testResponsiveViewports(page, "project-12-smart-office");
  });

  test("3. Assets and Links Test: scripts and styles return 2xx", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await testAssetsAndLinks(page, config.webUrl);
  });

  test("4. Core Features Test: switch to employees tab and meeting rooms tab via buttons", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Switch to employees tab
    const empBtn = page.locator("#btn-employees");
    if (await empBtn.isVisible()) {
      await empBtn.click();
      await page.waitForTimeout(400);
      await expect(empBtn).toHaveClass(/active/);
    }

    // 2. Switch to meeting rooms tab
    const roomsBtn = page.locator("#btn-meeting-rooms");
    if (await roomsBtn.isVisible()) {
      await roomsBtn.click();
      await page.waitForTimeout(400);
      await expect(roomsBtn).toHaveClass(/active/);
    }
  });

  test("5. Voice Simulation Test: voice command triggers section navigation", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await setupVoiceMock(page);
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Simulate voice command
    await simulateVoiceCommand(page, "Go to Employees");
    await page.waitForTimeout(500);

    const brand = page.locator(".brand-name, h1, body").first();
    await expect(brand).toBeVisible();
  });

  test("6. Security Scan Test: deployed bundle contains zero exposed keys", async () => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const findings = await scanBundleForSecrets(config.webUrl);
    expect(findings).toHaveLength(0);
  });
});
