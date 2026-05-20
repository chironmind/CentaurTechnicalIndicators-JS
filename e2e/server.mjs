// Tiny static file server for Playwright web-target smoke tests.
// Serves the repo root so both `/index.web.js` (the wrapper) and
// `/dist/web/centaur-technical-indicators.js` (the bundler flat export)
// resolve, along with the .wasm artefact.
//
// Runs on port 3007 by default (overridable via PORT env). Logs nothing
// unless DEBUG=1 to keep Playwright output readable.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(import.meta.url);
const ROOT = resolve(here, "..", "..");

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".d.ts": "text/plain; charset=utf-8",
};

const PORT = Number(process.env.PORT ?? 3007);

const server = createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(req.url.split("?")[0]);
    const filePath = resolve(ROOT, "." + normalize(requested));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    const s = await stat(filePath);
    if (s.isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    const data = await readFile(filePath);
    const mime = MIME[extname(filePath)] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" });
    res.end(data);
  } catch {
    res.writeHead(404).end();
  }
});

server.listen(PORT, () => {
  if (process.env.DEBUG === "1") {
    console.log(`smoke-server listening on http://localhost:${PORT}`);
  }
});
