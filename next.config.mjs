const isGithubActions = process.env.GITHUB_ACTIONS === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isGithubActions ? "/WritingCoach" : undefined,
  assetPrefix: isGithubActions ? "/WritingCoach/" : undefined
};

export default nextConfig;
