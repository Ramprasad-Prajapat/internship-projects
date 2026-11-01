import https from "https";
import http from "http";

export interface SecretFinding {
  url: string;
  pattern: string;
}

export async function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "Playwright-SecurityScan" } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchText(res.headers.location));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

export async function scanBundleForSecrets(baseUrl: string): Promise<SecretFinding[]> {
  const findings: SecretFinding[] = [];
  if (!baseUrl || baseUrl === "TODO") return findings;

  try {
    const html = await fetchText(baseUrl);

    // Regex secret patterns
    const patterns: Array<{ name: string; regex: RegExp }> = [
      { name: "Google API Key", regex: /AIza[0-9A-Za-z-_]{35}/g },
      { name: "OpenAI Secret Key", regex: /sk-[a-zA-Z0-9]{20,}/g },
      { name: "GitHub Personal Token", regex: /ghp_[a-zA-Z0-9]{20,}/g },
      { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/g },
      { name: "RSA/Private Key", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
    ];

    for (const p of patterns) {
      if (p.regex.test(html)) {
        findings.push({ url: `${baseUrl} (index.html)`, pattern: p.name });
      }
    }

    // Extract script src links
    const scriptMatches = html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi);
    const scriptUrls: string[] = [];
    for (const m of scriptMatches) {
      const src = m[1];
      if (src && !src.startsWith("http") && !src.startsWith("//")) {
        const fullUrl = new URL(src, baseUrl).toString();
        scriptUrls.push(fullUrl);
      }
    }

    // Scan linked script files
    for (const sUrl of scriptUrls) {
      try {
        const js = await fetchText(sUrl);
        for (const p of patterns) {
          if (p.regex.test(js)) {
            findings.push({ url: sUrl, pattern: p.name });
          }
        }
      } catch (_e) {
        // script fetch failed or external
      }
    }
  } catch (_err) {
    // page unreachable
  }

  return findings;
}
