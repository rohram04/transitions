/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image/**",
      },
      {
        protocol: "http",
        hostname: "iconizer.net",
        port: "",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        port: "",
        pathname: "/platform/profilepic/**",
      },
    ],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["knex", "pg"],
  },
};

module.exports = nextConfig;
