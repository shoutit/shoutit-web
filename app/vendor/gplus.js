/**
 * Created by Philip on 12.01.2015.
 */

var request = require("superagent");

function connectGoogle(authResult) {
	  request.post("/oauth/gplus")
		.send({code: authResult.code})
		.end(function (res) {
			  console.log(res.status, res.body);
		});
}

function signInCallback(authResult) {
	  if (authResult["access_token"]) {
		// Autorisierung erfolgreich
		// Nach der Autorisierung des Nutzers nun die Anmeldeschaltfläche ausblenden, zum Beispiel:
		  document.getElementById("signinButton").setAttribute("style", "display: none");
		  console.log(authResult);
		  connectGoogle(authResult);
	} else if (authResult["error"]) {
		// Es gab einen Fehler.
		// Mögliche Fehlercodes:
		//   "access_denied" – Der Nutzer hat den Zugriff für Ihre App abgelehnt.
		//   "immediate_failed" – Automatische Anmeldung des Nutzers ist fehlgeschlagen.
		// console.log('Es gab einen Fehler: ' + authResult['Fehler']);
		  console.error(authResult["error"]);
	}
}

module.exports = {
	  init: function (window) {
		  var po = document.createElement("script");
		  po.type = "text/javascript";
		  po.async = true;
		  po.src = "https://apis.google.com/js/client:plusone.js";
		  var s = document.getElementsByTagName("script")[0];
		  s.parentNode.insertBefore(po, s);

		  window.signInCallback = signInCallback;
	}
};

