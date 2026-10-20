import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4174);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch (error) {
    console.warn("Invalid request URL:", error.message);
    response.writeHead(400).end("Invalid request URL");
    return;
  }

  const file = resolve(root, pathname === "/" ? "index.html" : `.${pathname}`);
  const relativePath = relative(root, file);
  if (relativePath.startsWith("..") || isAbsolute(relativePath) || pathname.includes("\0")) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  let info;
  try {
    info = await stat(file);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      response.writeHead(404).end("Not found");
      return;
    }
    console.error("Unable to read file:", error);
    response.writeHead(500).end("Unable to read file");
    return;
  }
  if (!info.isFile()) {
    response.writeHead(404).end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    "Content-Length": info.size,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  const stream = createReadStream(file);
  stream.on("error", (error) => {
    console.error("Unable to stream file:", error);
    response.destroy(error);
  });
  response.on("close", () => stream.destroy());
  stream.pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Contoso Account Services: http://127.0.0.1:${port}`);
});
