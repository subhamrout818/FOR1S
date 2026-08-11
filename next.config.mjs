/** @type {import('next').NextConfig} */

// Pragmatic CSP: Next.js hydration + GSAP/framer-motion rely on inline
// scripts/styles, so 'unsafe-inline' stays for now. The meaningful wins over
// no CSP: no external script origins, no framing, restricted exfiltration
// (connect-src 'self'), and base-uri/form-action locked down. Sessions are
// also httpOnly-cookie-based now, so even a script injection can't lift the
// token from localStorage.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' https: blob:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Force HTTPS for 2 years, including all subdomains.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Prevent cross-origin window/iframe references — mitigates Spectre-style
  // side-channel attacks and blocks cross-origin pop-up framing.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Internal workspaces and auth pages must never appear in search results.
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/dashboard/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/login", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/register", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/forgot-password", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/reset-password", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/oauth/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
