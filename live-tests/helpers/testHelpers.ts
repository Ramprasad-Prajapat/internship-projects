import fs from "fs";
import path from "path";
import { Page, expect } from "@playwright/test";

export interface ProjectEntry {
  name: string;
  type: string;
  webUrl: string;
  apiUrl?: string;
  wsUrl?: string;
}

export function getTargetEnvironment(): "production" | "local" {
  const target = process.env.TARGET?.toLowerCase();
  return target === "local" ? "local" : "production";
}

export function getProjectConfig(projectId: string): ProjectEntry {
  const urlsPath = path.resolve(__dirname, "..", "urls.json");
  const raw = fs.readFileSync(urlsPath, "utf-8");
  const data = JSON.parse(raw);
  const env = getTargetEnvironment();
  const entry = data[env]?.[projectId];
  if (!entry) {
    throw new Error(`Project ${projectId} not found in urls.json under ${env}`);
  }
  return entry;
}

export async function attachPageErrorListeners(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => {
    errors.push(`[PageError] ${err.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      // Allowlist common CDN or benign network tracker fails
      if (
        !text.includes("favicon") &&
        !text.includes("analytics") &&
        !text.includes("google-analytics") &&
        !text.includes("doubleclick")
      ) {
        errors.push(`[ConsoleError] ${text}`);
      }
    }
  });
  return errors;
}

export async function warmUpService(url: string, timeoutMs: number = 120000): Promise<boolean> {
  if (!url || url === "TODO") return false;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        return true;
      }
    } catch (_err) {
      // service waking up
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}
