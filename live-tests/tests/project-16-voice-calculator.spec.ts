import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";
import { setupVoiceMock, simulateVoiceCommand, getSpokenTranscripts } from "../helpers/voiceSimulation";
import { scanBundleForSecrets } from "../helpers/securityScanner";
import { testResponsiveViewports, testAssetsAndLinks } from "../helpers/auditHelpers";

test.describe("project-16: vocalic-voice-calculator-web-app", () => {
  const config = getProjectConfig("project-16");

  test("1. Smoke Test: page loads with 200, brand title VOCALIC MATH visible @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const title = page.locator(".brand-title, h1, body").first();
    await expect(title).toContainText(/VOCALIC MATH/i);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("2. Responsive Test: desktop and mobile viewport rendering", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await testResponsiveViewports(page, "project-16-voice-calculator");
  });

  test("3. Assets and Links Test: scripts and styles return 2xx", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await testAssetsAndLinks(page, config.webUrl);
  });

  test("4. Core Features Test: calculate 7 + 5 = 12 using manual calculator keypads", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Press C (Clear)
    const btnC = page.locator("button.calc-btn:has-text('C')").first();
    await btnC.click();
    await page.waitForTimeout(200);

    // Press 7
    const btn7 = page.locator("button.calc-btn:has-text('7')").first();
    await btn7.click();
    await page.waitForTimeout(200);

    // Press +
    const btnPlus = page.locator("button.calc-btn:has-text('+')").first();
    await btnPlus.click();
    await page.waitForTimeout(200);

    // Press 5
    const btn5 = page.locator("button.calc-btn:has-text('5')").first();
    await btn5.click();
    await page.waitForTimeout(200);

    // Press =
    const btnEq = page.locator("button.calc-btn:has-text('=')").first();
    await btnEq.click();
    await page.waitForTimeout(300);

    // Verify LCD display result shows 12
    const display = page.locator("#lbl-result, .lcd-display, #lbl-formula").first();
    await expect(display).toContainText(/12/);
  });

  test("5. Voice Simulation Test: speech recognition computes 7 plus 5 and synthesizes answer", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await setupVoiceMock(page);
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Click mic button to activate recognition
    const micBtn = page.locator("#mic-trigger-btn, .mic-btn").first();
    if (await micBtn.isVisible()) {
      await micBtn.click();
      await page.waitForTimeout(300);
    }

    // Simulate voice command "7 plus 5"
    await simulateVoiceCommand(page, "7 plus 5");
    await page.waitForTimeout(500);

    // Assert display updated or formula includes 12
    const display = page.locator("#lbl-result, .lcd-display, #lbl-formula").first();
    await expect(display).toContainText(/12/);

    // Assert TTS spoken output was recorded
    const spoken = await getSpokenTranscripts(page);
    expect(spoken.some((s) => s.includes("12") || s.includes("result"))).toBeTruthy();
  });

  test("6. Voice Error Simulation Test: speech recognition error is handled gracefully", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await setupVoiceMock(page);
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Trigger error simulation
    await page.evaluate(() => (window as any).__simulateVoiceError?.("not-allowed"));
    await page.waitForTimeout(300);

    // App should remain functional and intact
    const title = page.locator(".brand-title, h1").first();
    await expect(title).toBeVisible();
  });

  test("7. Security Scan Test: deployed bundle contains zero exposed keys", async () => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const findings = await scanBundleForSecrets(config.webUrl);
    expect(findings).toHaveLength(0);
  });
});
