const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4000);
const host = "127.0.0.1";
const landingRoot = path.join(__dirname, "..", "acttub-landing");

const rewrites = [
  ["/ACTI", "https://acti-tau.vercel.app/ACTI"],
  ["/archive", "https://acttub-archive.vercel.app/archive"],
  ["/community", "https://acttub-comm.vercel.app/community"],
  ["/excer", "https://acttub-excer.vercel.app/excer"],
  ["/thea", "https://thea-zeta.vercel.app/thea"],
];

function rewriteFor(pathname) {
  for (const [source, destination] of rewrites) {
    if (pathname === source || pathname.startsWith(`${source}/`)) {
      return `${destination}${pathname.slice(source.length)}`;
    }
  }
}

function contentType(filePath) {
  switch (path.extname(filePath)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

function serveLanding(request, response) {
  const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.normalize(path.join(landingRoot, pathname));

  if (!filePath.startsWith(landingRoot)) {
    response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "content-type": contentType(filePath) });
    response.end(data);
  });
}

function proxy(request, response, destination) {
  const url = new URL(destination);
  const client = url.protocol === "https:" ? https : http;

  const proxyRequest = client.request(
    {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: `${url.pathname}${url.search}`,
      method: request.method,
      headers: { ...request.headers, host: url.hostname },
    },
    (proxyResponse) => {
      response.writeHead(proxyResponse.statusCode || 500, proxyResponse.headers);
      proxyResponse.pipe(response);
    },
  );

  proxyRequest.on("error", (error) => {
    response.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Proxy error: ${error.message}`);
  });

  request.pipe(proxyRequest);
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);
  const destination = rewriteFor(requestUrl.pathname);

  if (destination) {
    proxy(request, response, `${destination}${requestUrl.search}`);
    return;
  }

  serveLanding(request, response);
});

server.listen(port, host, () => {
  console.log(`Acttub local gateway: http://localhost:${port}`);
});
