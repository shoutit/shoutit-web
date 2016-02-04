/**
 * Created by Philip on 07.05.2015.
 */

export default function(appId) {
    // Facebook init
  if (window.FB) {
      window.FB.init({
          appId: appId,
          version: "v2.0"
        });
    }
}
