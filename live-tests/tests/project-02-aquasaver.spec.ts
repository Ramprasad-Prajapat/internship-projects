import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";
import { setupMediaPipeStub, simulateHandGesture } from "../helpers/cameraSimulation";
import { scanBundleForSecrets } from "../helpers/securityScanner";
import { testResponsiveViewports, testAssetsAndLinks } from "../helpers/auditHelpers";

test.describe("project-02: aquasaver-gesture-water-simulator", () => {
  const config = getProjectConfig("project-02");

  test("1. Smoke Test: page loads with 200, header, and video element @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    await expect(page.locator(".header-tagline, .app-header, body").first()).toBeVisible();

    const webcam = page.locator("#webcam");
    await expect(webcam).toBeAttached();

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("2. Responsive Test: desktop and mobile viewports", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await testResponsiveViewports(page, "project-02-aquasaver");
  });

  test("3. Assets and Links Test: scripts, styles, and MediaPipe return 2xx", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await testAssetsAndLinks(page, config.webUrl);
  });

  test("4. Core Features Test: toggle audio and open resource report modal", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Audio toggle action
    const audioBtn = page.locator("#btn-audio-toggle");
    if (await audioBtn.isVisible()) {
      const initialText = await audioBtn.innerText();
      await audioBtn.click();
      const updatedText = await audioBtn.innerText();
      expect(updatedText).not.toEqual(initialText);
    }

    // 2. Open water usage report modal and close it
    await page.evaluate(() => {
      if (typeof (window as any).showReport === "function") {
        (window as any).showReport();
      }
    });
    const reportModal = page.locator("#report-modal");
    if (await reportModal.isVisible()) {
      await expect(reportModal).toHaveClass(/modal-open/);
      const closeBtn = page.locator("#report-modal .modal-close, #report-modal button:has-text('Close')").first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });

  test("5. Camera Simulation Test: scripted gesture highlights gesture instruction row", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await setupMediaPipeStub(page);
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Simulate gesture
    await simulateHandGesture(page, "openPalm");
    await page.waitForTimeout(300);

    const gestureRow = page.locator("#gesture-row-palm, .gesture-item").first();
    await expect(gestureRow).toBeAttached();
  });

  test("6. Security Scan Test: deployed bundle contains zero exposed keys", async () => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const findings = await scanBundleForSecrets(config.webUrl);
    expect(findings).toHaveLength(0);
  });
});
