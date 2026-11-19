import type { NextConfig } from "next";

// Static export for GitHub Pages: `next build` writes plain HTML/CSS/JS to ./out.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // /resume -> /resume/index.html, which GitHub Pages serves reliably
  images: { unoptimized: true }, // the image optimiser needs a server
};

export default nextConfig;
