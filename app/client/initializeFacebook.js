/* eslint no-var: 0 */
/* eslint-env browser */
import debug from "debug";

const log = debug("shoutit:facebook");

let appId;
let version;
if (process.env.NODE_ENV === "development" || process.env.SHOUTIT_ENV === "stage") {
  appId = "1151546964858487";
  version = "v2.0";
}
else {
  appId = "353625811317277";
  version = "v2.0";
}

window.fbAsyncInit = function() {
  log("Facebook SDK has been loaded.");
  window.FB.init({ appId, version });
  log("Facebook App: " + appId + " has been initialized.");
};

(function(d, s, id) {
  var js;
  var fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "facebook-jssdk"));
