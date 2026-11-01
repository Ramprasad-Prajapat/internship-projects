const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");

const serversConfig = [
  { port: 4102, dir: path.join(root, "project-02", "aquasaver-gesture-water-simulator"), spa: false },
  { port: 4103, dir: path.join(root, "project-03", "developer-portfolio-react-typescript", "dist"), spa: true },
  { port: 4104, dir: path.join(root, "project-04", "eco-ninja-gesture-slicing-game"), spa: false },
  { port: 4105, dir: path.join(root, "project-05", "facetrack-ai-attendance-system", "frontend", "dist"), spa: true },
  { port: 4107, dir: path.join(root, "project-07", "mental-wellness-chat-and-meditation-platform"), spa: false },
  { port: 4111, dir: path.join(root, "project-11", "smart-home-gesture-control-dashboard"), spa: false },
  { port: 4112, dir: path.join(root, "project-12", "smart-office-voice-dashboard"), spa: false },
  { port: 4114, dir: path.join(root, "project-14", "touchless-hospital-gesture-interface"), spa: false },
  { port: 4116, dir: path.join(root, "project-16", "vocalic-voice-calculator-web-app"), spa: false },
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
};

const activeServers = [];

for (const { port, dir, spa } of serversConfig) {
  const server = http.createServer((req, res) => {
    // Add CORS headers for local testing
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    let reqPath = decodeURI(req.url.split("?")[0]);
    if (reqPath === "/") reqPath = "/index.html";

    let filePath = path.join(dir, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        if (spa) {
          filePath = path.join(dir, "index.html");
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("404 Not Found");
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          return res.end("500 Server Error");
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      });
    });
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`[LocalServer] Serving ${dir} on http://127.0.0.1:${port}`);
  });

  activeServers.push(server);
}
