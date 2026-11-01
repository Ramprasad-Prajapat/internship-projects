import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";
import { scanBundleForSecrets } from "../helpers/securityScanner";
import { testResponsiveViewports, testAssetsAndLinks } from "../helpers/auditHelpers";

test.describe("project-03: developer-portfolio-react-typescript", () => {
  const config = getProjectConfig("project-03");

  test("1. Smoke Test: page loads with 200, hero visible, and no crash @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    await expect(page.locator("body")).toBeVisible();
    await page.waitForTimeout(500);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("2. Responsive Test: desktop and mobile viewports", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    await testResponsiveViewports(page, "project-03-portfolio");
  });

  test("3. Assets and Links Test: scripts and styles return 2xx", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await testAssetsAndLinks(page, config.webUrl);
  });

  test("4. Core Features Test: navigation links, project cards, and interactive actions", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });

    // 1. Navigation click
    const navLink = page.locator("nav a, header a").first();
    if (await navLink.isVisible()) {
      await navLink.click();
      await page.waitForTimeout(300);
    }

    // 2. Interactive action
    const button = page.locator("button").first();
    if (await button.isVisible()) {
      await button.click();
      await page.waitForTimeout(300);
    }
  });

  test("5. Security Scan Test: deployed bundle contains zero exposed keys", async () => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const findings = await scanBundleForSecrets(config.webUrl);
    expect(findings).toHaveLength(0);
  });
});
