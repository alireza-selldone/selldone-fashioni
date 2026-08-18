const ORIGIN =
  "https://raw.githubusercontent.com/alireza-selldone/selldone-fashioni/f83b19b21e9ef85ef8d25a3d0ea38171e5479141/dist";

const TYPES = {
  html: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  ttf: "font/ttf",
  woff: "font/woff",
  woff2: "font/woff2",
  ico: "image/x-icon",
};

const STRIP = [
  "content-security-policy",
  "content-security-policy-report-only",
  "cross-origin-resource-policy",
  "x-frame-options",
  "x-xss-protection",
  "via",
  "expires",
];

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const url = new URL(request.url);
    let path = decodeURIComponent(url.pathname);
    if (path === "/") path = "/index.html";
    else if (path === "/callback/" || path === "/callback") path = "/callback/index.html";
    else if (path === "/dashboard/" || path === "/dashboard") path = "/dashboard/index.html";
    else if (!/\.[a-z0-9]+$/i.test(path)) path = `${path.replace(/\/$/, "")}.html`;

    if (path.includes("..")) return new Response("Bad Request", { status: 400 });

    const immutable = /\.(?:png|jpe?g|ttf|woff2?)$/i.test(path);
    const upstream = await fetch(`${ORIGIN}${path}`, {
      cf: { cacheEverything: true, cacheTtl: immutable ? 31_536_000 : 60 },
    });
    if (!upstream.ok) {
      return new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const headers = new Headers(upstream.headers);
    for (const key of STRIP) headers.delete(key);
    for (const [key] of headers) {
      if (key.startsWith("x-github-") || key.startsWith("x-fastly-") || key === "source-age") {
        headers.delete(key);
      }
    }

    const extension = path.split(".").pop().toLowerCase();
    if (TYPES[extension]) headers.set("Content-Type", TYPES[extension]);
    headers.set(
      "Cache-Control",
      immutable
        ? "public, max-age=31536000, immutable"
        : "public, max-age=60, s-maxage=60",
    );
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    return new Response(request.method === "HEAD" ? null : upstream.body, {
      status: upstream.status,
      headers,
    });
  },
};
