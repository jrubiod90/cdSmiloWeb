const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repoName = 'cdSmiloWeb'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
