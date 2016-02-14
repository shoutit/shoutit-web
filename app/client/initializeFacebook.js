/* eslint no-var: 0 */
/* eslint-env browser */
import debug from "debug";

const log = debug("shoutit:facebook");

window.fbAsyncInit = function() {
  log("Facebook SDK has been loaded.");
  window.FB.init({
    appId      : "353625811317277",
    version    : "v2.5"
  });
  log("Facebook has been initialized.");
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "facebook-jssdk"));
