/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // No ESLint config is included in this v1 — skip it during build rather than
    // letting Next.js prompt to install one, which fails in Netlify's non-interactive CI.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
