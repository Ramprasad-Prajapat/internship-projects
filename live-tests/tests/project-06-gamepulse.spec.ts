import { test, expect } from "@playwright/test";
import { getProjectConfig, attachPageErrorListeners } from "../helpers/testHelpers";

test.describe("project-06: gamepulse-live-cricket-scoring-platform", () => {
  const config = getProjectConfig("project-06");
  const testId = `autotest_${Date.now()}`;
  const testUser = {
    name: "Autotest Scorer",
    email: `${testId}@example.com`,
    password: "Password123!",
  };

  test("API Test: health endpoint returns 200 and UP status @api", async ({ request }) => {
    test.skip(!config.apiUrl || config.apiUrl === "TODO", "API URL is not configured yet (TODO)");
    const apiUrl = config.apiUrl!;
    const healthUrl = apiUrl.endsWith("/health")
      ? apiUrl
      : `${apiUrl.replace(/\/+$/, "")}/health`;

    const res = await request.get(healthUrl);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("UP");
  });

  test("API Test: user registration, login, and token generation @api", async ({ request }) => {
    test.skip(!config.apiUrl || config.apiUrl === "TODO", "API URL is not configured yet (TODO)");
    const base = config.apiUrl!.replace(/\/+$/, "");

    // 1. Register
    const regRes = await request.post(`${base}/auth/register`, {
      data: testUser,
    });
    expect([200, 201]).toContain(regRes.status());

    // 2. Login
    const loginRes = await request.post(`${base}/auth/login`, {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    expect(loginBody.accessToken || loginBody.token).toBeDefined();
  });

  test("Smoke & UI Test: frontend loads with 200 and live cricket platform UI @smoke", async ({ page }) => {
    test.skip(!config.webUrl || config.webUrl === "TODO", "Web URL is not configured yet (TODO)");
    const errors = await attachPageErrorListeners(page);

    const response = await page.goto(config.webUrl, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    await expect(page.locator("body")).toBeVisible();
    await page.waitForTimeout(1000);

    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });
});
