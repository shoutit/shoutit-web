/* eslint no-var: 0 */

var publicUrl = process.env.SHOUTIT_PUBLIC_URL || "";
var apiUrl = process.env.SHOUTIT_API_URL || "http://dev.api.shoutit.com/v2/";

module.exports = {
  publicUrl: publicUrl,
  googleMapsKey: "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc",
  apiUrl: apiUrl,
  imagesPath: publicUrl + "/images"
};
