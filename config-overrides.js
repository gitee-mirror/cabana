const path = require("path");
const fs = require("fs");
var SentryPlugin = require("webpack-sentry-plugin");

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /worker\.js$/,
    include: path.resolve("./src"),
    use: [{ loader: "worker-loader" }, { loader: "babel-loader" }]
  });

  config.module.rules.push({
    test: /\.(js|jsx)$/,
    include: path.resolve(
      fs.realpathSync(process.cwd()),
      "node_modules/streamsaver"
    ),
    use: { loader: "babel-loader" }
  });

  if (env === "production") {
    const COMMIT = process.env.TRAVIS_COMMIT || process.env.COMMIT_REF;
    const tagName = process.env.TRAVIS_TAG;
    // only use sentry on production builds
    if (tagName && tagName.length) {
      config.plugins.push(
        new SentryPlugin({
          organisation: "commaai",
          project: "cabana",
          apiKey: process.env.SENTRY_API_KEY,
          release: function(hash) {
            return COMMIT + ";" + hash; // webpack build hash
          }
        })
      );
    }
  }

  return config;
};
