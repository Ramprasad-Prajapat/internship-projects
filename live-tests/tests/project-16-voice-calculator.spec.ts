import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-16: vocalic-voice-calculator-web-app", () => {
  const config = getProjectConfig("project-16");

  test("Smoke Test: page loads with 200, brand title VOCALIC MATH visible @smoke", async ({ page }) => {
    test.skip(config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const title = page.locator(".brand-title, h1, body").first();
    await expect(title).toContainText(/VOCALIC MATH/i);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Interaction Test: calculate 7 + 5 = 12 using manual calculator keypads", async ({ page }) => {
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
});
