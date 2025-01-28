/** @type {import("next").NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "cdn.discordapp.com",
            "static.truckersmp.com",
            "avatars.akamai.steamstatic.com"
        ]
    },
    env: {
        NEXT_PUBLIC_VERSION: require("./package.json").version,
        NEXT_PUBLIC_COMMIT: require("child_process").execSync("git rev-parse --short HEAD").toString().trim()
    }
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true" || process.env.ANALYZE === "1"
});

module.exports = withBundleAnalyzer(nextConfig);