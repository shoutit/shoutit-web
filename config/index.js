/* eslint no-var: 0 */

var publicUrl = process.env.SHOUTIT_PUBLIC_URL || "";
var apiUrl = process.env.SHOUTIT_API_URL || "http://dev.api.shoutit.com/v2/";

var uploadResources = {
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

module.exports = {
  publicUrl: publicUrl,
  googleMapsKey: "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc",
  apiUrl: apiUrl,
  imagesPath: publicUrl + "/images",
  uploadResources: uploadResources
};
