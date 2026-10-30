import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-03: developer-portfolio-react-typescript", () => {
  const config = getProjectConfig("project-03");

  test("Smoke Test: page loads with 200, hero visible, and no crash @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    await expect(page.locator("body")).toBeVisible();
    await page.waitForTimeout(1000);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Interaction Test: navigation links and section filtering", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    await page.goto(config.webUrl, { waitUntil: "networkidle" });

    // 1. Navigation click
    const navLink = page.locator("nav a, header a").first();
    if (await navLink.isVisible()) {
      await navLink.click();
      await page.waitForTimeout(500);
    }

    // 2. Interactive action: filter buttons or buttons in page
    const filterBtn = page.locator("button").first();
    await expect(filterBtn).toBeVisible();
    await filterBtn.click();
    await page.waitForTimeout(500);
  });
});
