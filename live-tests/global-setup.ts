import fs from "fs";
import path from "path";
import { getTargetEnvironment, warmUpService } from "./helpers/testHelpers";

export default async function globalSetup() {
  const env = getTargetEnvironment();
  const urlsPath = process.env.URLS_FILE
    ? path.resolve(process.env.URLS_FILE)
    : path.resolve(__dirname, "urls.json");
  if (!fs.existsSync(urlsPath)) return;

  const data = JSON.parse(fs.readFileSync(urlsPath, "utf-8"));
  const targetMap = data[env] || {};

  console.log(`[globalSetup] Warming up services for environment: ${env}`);
  for (const [key, proj] of Object.entries<any>(targetMap)) {
    if (proj.apiUrl && proj.apiUrl !== "TODO") {
      const healthUrl = proj.apiUrl.endsWith("/health")
        ? proj.apiUrl
        : `${proj.apiUrl.replace(/\/+$/, "")}/health`;
      console.log(`[globalSetup] Pinging ${key} health: ${healthUrl}`);
      const timeout = env === "local" ? 4000 : 120000;
      const ready = await warmUpService(healthUrl, timeout);
      console.log(`[globalSetup] ${key} ready: ${ready}`);
    }
  }
}
