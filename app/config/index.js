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

export const uploadResources = {
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

export const shoutitEnv = process.env.SHOUTIT_ENV;
export const googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
export const imagesPath = envConfig.publicUrl + "/images";
export const facebookId = envConfig.facebookId;
export const ga = envConfig.ga;
export const apiUrl = envConfig.apiUrl;
export const publicUrl = envConfig.publicUrl;
export const siteUrl = envConfig.siteUrl;

export function getSummary() {
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
  summary.push("  Site URL:             " + siteUrl);
  summary.push("  Public assets URL:    " + publicUrl);
  summary.push("  API URL:              " + apiUrl);
  summary.push("  Google Analytics:     " + ga);
  summary.push("  Images path:          " + imagesPath);
  summary.push("  Facebook ID:          " + facebookId);
  summary.push("");
  return summary.join("\n");
}
