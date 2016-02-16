/* eslint no-console: 0 */

let envConfig = {};
if (process.env.NODE_ENV === "development" || !process.env.SHOUTIT_ENV) {
  envConfig = require("./development");
} else if (process.env.SHOUTIT_ENV === "stage") {
  envConfig = require("./stage");
} else if (process.env.SHOUTIT_ENV === "beta") {
  envConfig = require("./beta");
} else if (process.env.SHOUTIT_ENV === "live") {
  envConfig = require("./live");
} else {
  throw "SHOUTIT_ENV is not valid.";
}

const uploadResources = {
  shout: {
    fieldname: "shout_image",
    bucket: "shoutit-shout-image-original",
    cdn: "https://shout-image.static.shoutit.com"
  },
  user: {
    fieldname: "user_image",
    bucket: "shoutit-user-image-original",
    cdn: "https://user-image.static.shoutit.com"
  },
  tag: {
    fieldname: "tag_image",
    bucket: "shoutit-tag-image-original",
    cdn: "https://tag-image.static.shoutit.com"
  }
};

function printSummary() {
  const summary = [];
  summary.push("");
  summary.push("shoutit-web-app");
  summary.push("------------------------------------------------------------");
  summary.push("");
  summary.push("  Shoutit environment:  " + process.env.SHOUTIT_ENV);
  summary.push("  Node environment:     " + process.env.NODE_ENV);
  summary.push("  Redis host:           " + process.env.REDIS_HOST);
  summary.push("  New Relic Key:        " + process.env.NEW_RELIC_LICENSE_KEY);
  summary.push("");
  summary.push("  Public assets URL:    " + config.publicUrl);
  summary.push("  API URL:              " + config.apiUrl);
  summary.push("  Google Analytics:     " + config.ga);
  summary.push("  Images path:          " + config.imagesPath);
  summary.push("  Facebook ID:          " + config.facebookId);
  summary.push("");

  console.log(summary.join("\n"));
}

const config = {
  shoutitEnv: process.env.SHOUTIT_ENV,
  googleMapsKey: "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc",
  imagesPath: envConfig.publicUrl + "/images",
  uploadResources,
  printSummary,
  ...envConfig
};

export default config;
