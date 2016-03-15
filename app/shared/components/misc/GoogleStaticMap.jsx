import React from "react";
import { googleMapsKey } from "../../../config";
import { createLinkToGoogleMaps } from "../../../utils/GoogleMapsUtils";

export default function GoogleStaticMap({
  // pass location
  location,

  // or the center and a set of markers to add
  center={ latitude: 40.714728, longitude: -73.998672 },
  markers,

  zoom=13,
  width=300,
  height=200,
  language="en-us",
  mapType="roadmap"

}) {

  if (location) {
    center = location;
    markers = [location];
  }

  const src = ["https://maps.googleapis.com/maps/api/staticmap?"];

  src.push(`key=${googleMapsKey}`);
  src.push("scale=2"); // for retina displays

  src.push(`center=${center.latitude},${center.longitude}`);
  src.push(`zoom=${zoom}`);
  src.push(`size=${width}x${height}`);
  src.push(`maptype=${mapType}`);
  src.push(`language=${language}`);

  markers.forEach(marker => {
    const {
      latitude=center.latitude,
      longitude=center.longitude,
      size="small",
      color="0xff0000"
    } = marker;

    src.push(`markers=size:${size}%7Ccolor:${color}%7Clabel:A%7C${latitude},${longitude}`);
  });

  const href = createLinkToGoogleMaps(location || center);

  return (
    <a href={ href } target="_blank">
      <img src={ src.join("&") } width={ width } height={ height } />
    </a>
  );
}
