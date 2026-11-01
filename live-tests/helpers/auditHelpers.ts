import { Page, BrowserContext, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

export async function testResponsiveViewports(page: Page, projectName: string) {
  const screenshotsDir = path.resolve(__dirname, "..", "artifacts", "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // 1. Desktop: 1366 x 768
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.waitForTimeout(300);
  const desktopOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 5;
  });
  expect(desktopOverflow, `Horizontal overflow detected on desktop viewport (1366x768) in ${projectName}`).toBeFalsy();
  await page.screenshot({ path: path.join(screenshotsDir, `${projectName}-desktop.png`) });

  // 2. Mobile: 390 x 844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 10;
  });
  expect(mobileOverflow, `Horizontal overflow detected on mobile viewport (390x844) in ${projectName}`).toBeFalsy();
  await page.screenshot({ path: path.join(screenshotsDir, `${projectName}-mobile.png`) });

  // Restore desktop default
  await page.setViewportSize({ width: 1280, height: 800 });
}

export async function testAssetsAndLinks(page: Page, url: string) {
  const failedRequests: string[] = [];

  page.on("response", (response) => {
    const resUrl = response.url();
    const status = response.status();
    // Allow status 200..399
    if (status >= 400) {
      // Ignore benign external telemetry
      if (
        !resUrl.includes("favicon") &&
        !resUrl.includes("google-analytics") &&
        !resUrl.includes("analytics") &&
        !resUrl.includes("stats")
      ) {
        failedRequests.push(`${resUrl} [HTTP ${status}]`);
      }
    }
  });

  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);

  // Wait for network idle or 3s max
  await page.waitForLoadState("load").catch(() => {});
  await page.waitForTimeout(1000);

  expect(failedRequests, `Failed network requests during asset load: ${failedRequests.join(", ")}`).toHaveLength(0);
}

export async function testPermissionDeniedHandling(
  contextCreator: () => Promise<BrowserContext>,
  url: string,
  permission: "camera" | "microphone"
) {
  // Create an isolated context where permissions are denied
  const context = await contextCreator();
  await context.clearPermissions();
  const page = await context.newPage();

  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);

  // Allow app logic to handle denied state
  await page.waitForTimeout(1500);

  // App should not crash
  expect(errors).toHaveLength(0);

  await context.close();
}
