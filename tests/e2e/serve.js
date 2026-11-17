// Tiny static server over the exported site (out/), for the Playwright checks.
// Form POSTs (Netlify Forms) are accepted and recorded so the lead flow can run end to end.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

module.exports = function serve(root, port) {
  const posts = [];
  const server = http.createServer((req, res) => {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (d) => (body += d));
      req.on("end", () => {
        posts.push(req.url + " " + body);
        res.end("ok");
      });
      return;
    }
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    let file = path.join(root, p);
    if (fs.existsSync(file + ".html")) file += ".html";
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.statusCode = 404;
      return res.end();
    }
    res.setHeader("content-type", types[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  });
  server.posts = posts;
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
};
