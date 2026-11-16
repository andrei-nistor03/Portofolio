/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // QR code on the business card points to /card. Serve the homepage there
  // (a rewrite, not a redirect) so the URL stays /card and Vercel Analytics
  // counts each scan as a /card page view.
  async rewrites() {
    return [{ source: "/card", destination: "/" }];
  },
};
export default nextConfig;
