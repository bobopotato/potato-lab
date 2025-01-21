//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require("@nx/next");
const withBundleAnalyzer = require("@next/bundle-analyzer");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/dashboard/introduction", permanent: true }
    ]; // Set to true for permanent redirect (308) or false for temporary redirect (307) },
  },
  images: {
    domains: ["image-service-cdn.seek.com.au"]
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["fs"] = false;
    config.resolve.alias["crypto"] = false;
    config.resolve.alias["pg-native"] = false;
    config.resolve.alias["dns"] = false;
    config.resolve.alias["net"] = false;
    config.resolve.alias["tls"] = false;
    return config;
  }
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true"
  })
];

module.exports = composePlugins(...plugins)(nextConfig);
