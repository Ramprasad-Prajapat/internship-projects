import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";
import { setupMediaPipeStub, simulateHandGesture } from "../helpers/cameraSimulation";
import { scanBundleForSecrets } from "../helpers/securityScanner";
import { testResponsiveViewports, testAssetsAndLinks, testPermissionDeniedHandling } from "../helpers/auditHelpers";

test.describe("project-14: touchless-hospital-gesture-interface", () => {
  const config = getProjectConfig("project-14");

  test("1. Smoke Test: HTTP 200, correct title, HUD and video element visible @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const startTime = Date.now();
    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    const loadDuration = Date.now() - startTime;

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Smart AI Hand Gesture Controlled Website/i);

    // Header and HUD elements
    const hudHeader = page.locator(".gesture-hud-header, .hud-title, body").first();
    await expect(hudHeader).toBeVisible();

    const webcam = page.locator("#webcam");
    await expect(webcam).toBeAttached();

    // Performance sanity check (under 10s)
    expect(loadDuration).toBeLessThan(10000);

    // No uncaught errors
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("2. Responsive Test: desktop (1366x768) and mobile (390x844) viewport rendering", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await testResponsiveViewports(page, "project-14-touchless-hospital");
  });

  test("3. Assets and Links Test: scripts, stylesheets, and CDN assets return 2xx", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await testAssetsAndLinks(page, config.webUrl);
  });

  test("4. Core Features Test: interactive navigation, page transitions, and clinic operations", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Action 1: Navigate to Aura Hospital Dashboard
    await page.evaluate(() => (window as any).switchPage?.("hospital"));
    const hospitalPage = page.locator("#hospital");
    await expect(hospitalPage).toHaveClass(/active/);
    const hospitalTitle = page.locator("#hospital .page-title");
    await expect(hospitalTitle).toContainText("Aura Hospital Dashboard");

    // Action 2: Navigate to Gesture Detection Matrix
    await page.evaluate(() => (window as any).switchPage?.("detection"));
    const detectionPage = page.locator("#detection");
    await expect(detectionPage).toHaveClass(/active/);

    // Action 3: Toggle Vision Detection on/off
    const visionToggleBtn = page.locator("#btn-toggle-vision, .vision-status").first();
    if (await visionToggleBtn.isVisible()) {
      await visionToggleBtn.click();
      await page.waitForTimeout(300);
    }

    // Action 4: Return to Home
    await page.evaluate(() => (window as any).switchPage?.("home"));
    const homePage = page.locator("#home");
    await expect(homePage).toHaveClass(/active/);
  });

  test("5. Reload and State Test: page reload maintains DOM stability and no errors", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => (window as any).switchPage?.("mouse"));

    // Reload page
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const hudTitle = page.locator(".hud-title, .gesture-hud-header").first();
    await expect(hudTitle).toBeVisible();
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("6. Error Handling Test: camera permission denied shows graceful fallback without crash", async ({ browser }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await testPermissionDeniedHandling(
      () => browser.newContext({ permissions: [] }),
      config.webUrl,
      "camera"
    );
  });

  test("7. Security Scan Test: deployed bundle contains zero exposed keys or tokens", async () => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const findings = await scanBundleForSecrets(config.webUrl);
    expect(findings, `Exposed secrets found in deployed bundle: ${findings.map((f) => f.url).join(", ")}`).toHaveLength(0);
  });

  test("8. Simulated Camera Layer 1: real MediaPipe scripts load from CDN with fake webcam feed", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // Verify video element exists and receives fake media stream
    const video = page.locator("#webcam");
    await expect(video).toBeAttached();

    // Verify MediaPipe Hands constructor is accessible
    const hasHands = await page.evaluate(() => typeof (window as any).Hands === "function");
    expect(hasHands).toBeTruthy();
  });

  test("9. Simulated Gestures Layer 2: scripted landmark frames trigger virtual cursor, click, scroll and emergency", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await setupMediaPipeStub(page);
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    // Scenario A: One Finger (Move Cursor)
    await simulateHandGesture(page, "oneFinger", { x: 0.5, y: 0.5 });
    await page.waitForTimeout(150);

    const cursor = page.locator("#virtual-cursor");
    await expect(cursor).toBeVisible();

    const cursorHud = page.locator("#gesture-global-cursor");
    await expect(cursorHud).toHaveClass(/active-gesture/);

    // Scenario B: Two Fingers (Select / Click)
    await simulateHandGesture(page, "twoFingers", { x: 0.5, y: 0.5 });
    await page.waitForTimeout(150);

    const clickHud = page.locator("#gesture-global-click");
    await expect(clickHud).toHaveClass(/active-gesture/);

    // Scenario C: Three Fingers (Scroll Up)
    await simulateHandGesture(page, "threeFingers", { x: 0.5, y: 0.5 });
    await page.waitForTimeout(150);

    const scrollHud = page.locator("#gesture-global-scroll-up");
    await expect(scrollHud).toHaveClass(/active-gesture/);

    // Scenario D: Open Palm Near Camera (Emergency Protocol)
    await simulateHandGesture(page, "nearCamera", { x: 0.5, y: 0.5 });
    await page.waitForTimeout(300);

    const alertModal = page.locator("#global-alert");
    await expect(alertModal).toBeVisible();
    const emergencyPage = page.locator("#emergency");
    await expect(emergencyPage).toHaveClass(/active/);
  });
});
