/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Apple iTunes / MusicKit artwork (is1 through is5)
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
      { protocol: "https", hostname: "is2-ssl.mzstatic.com" },
      { protocol: "https", hostname: "is3-ssl.mzstatic.com" },
      { protocol: "https", hostname: "is4-ssl.mzstatic.com" },
      { protocol: "https", hostname: "is5-ssl.mzstatic.com" },
      // GitHub avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Keep iconizer for any misc images
      { protocol: "http", hostname: "iconizer.net", pathname: "/files/**" },
    ],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["knex", "pg"],
  },
};

module.exports = nextConfig;
