/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        domains: [
            "cdn.discordapp.com",
            "static.truckersmp.com",
            "avatars.akamai.steamstatic.com"
        ]
    },
    env: {
        VERSION: require("./package.json").version
    }
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true" || process.env.ANALYZE === "1"
});

module.exports = withBundleAnalyzer(nextConfig);