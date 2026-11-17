import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export, deployed to Netlify as plain files.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
  reactStrictMode: true,
  // Netlify sets URL during its build (the site's primary address), so links and share images point at the deployed site.
  env: { NEXT_PUBLIC_SITE_URL: process.env.URL ?? "" },
  // Two root layouts (Hebrew at /, English at /en), so the 404 page is defined once in app/global-not-found.tsx.
  experimental: { globalNotFound: true, agentUpgrade: "security" },
};

export default nextConfig;
