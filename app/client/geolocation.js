/**
 * Created by Philip on 07.05.2015.
 */

function noLocation(supported) {
    console.warn("No Location found. Supported? " + supported);
}

export default function (cb) {
    if (window.google) {
        let gmaps = window.google.maps,
            pos;

        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = new gmaps.LatLng(position.coords.latitude, position.coords.longitude);

                cb(gmaps, pos);
            }, function () {
                noLocation(true);
                cb(gmaps);
            });
        } else {
            // Browser doesn't support Geolocation
            noLocation(false);
            cb(gmaps);
        }
    }
}
