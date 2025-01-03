//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require("@nx/next");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/dashboard", permanent: true }]; // Set to true for permanent redirect (308) or false for temporary redirect (307) },
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false
  },
  reactStrictMode: true
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx
];

module.exports = composePlugins(...plugins)(nextConfig);
