const baseConfig = require("../../eslint.config.js");

module.exports = [
  ...baseConfig,
  {
    ignores: [".serverless"]
  }
];
