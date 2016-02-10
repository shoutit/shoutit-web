/* eslint no-var: 0 */

var assetsUrl = process.env.SHOUTIT_ASSETS_URL || "";
var apiUrl = process.env.SHOUTIT_API_URL || "http://dev.api.shoutit.com/v2/";

module.exports = {
  assetsUrl: assetsUrl,
  googleMapsKey: "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc",
  apiUrl: apiUrl,
  imagesPath: assetsUrl + "/images"
};
