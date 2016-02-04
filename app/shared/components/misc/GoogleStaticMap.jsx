import React from "react";
import { googleMapsKey } from "../../../../config";

export default function GoogleStaticMap({
  center={ latitude: 40.714728, longitude: -73.998672 },
  zoom=13,
  width=300,
  height=200,
  language="en-us",
  mapType="roadmap",
  markers=[]
}) {

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


  return <img src={ src.join("&") } width={width} height={height} />;
}
