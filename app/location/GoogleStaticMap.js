import React, { PropTypes } from 'react';
import { googleMapsKey } from '../config';
import { createLinkToGoogleMaps } from '../utils/GoogleMapsUtils';

if (process.env.BROWSER) {
  require('./GoogleStaticMap.scss');
}
export default function GoogleStaticMap({
  // pass location
  location,

  // or the center and a set of markers to add
  center = { latitude: 40.714728, longitude: -73.998672 },
  markers,

  zoom = 13,
  width = 300,
  height = 200,
  language = 'en-us',
  mapType = 'roadmap',

}) {

  if (location) {
    center = location;
    markers = [location];
  }

  const imageUrl = ['https://maps.googleapis.com/maps/api/staticmap?'];

  imageUrl.push(`key=${googleMapsKey}`);
  imageUrl.push('scale=2'); // for retina displays

  imageUrl.push(`center=${center.latitude},${center.longitude}`);
  imageUrl.push(`zoom=${zoom}`);
  imageUrl.push(`size=${width}x${height}`);
  imageUrl.push(`maptype=${mapType}`);
  imageUrl.push(`language=${language}`);

  markers.forEach(marker => {
    const {
      latitude = center.latitude,
      longitude = center.longitude,
      size = 'small',
      color = '0xff0000',
    } = marker;

    imageUrl.push(`markers=size:${size}%7Ccolor:${color}%7Clabel:A%7C${latitude},${longitude}`);
  });

  const href = createLinkToGoogleMaps(location || center);

  const style = {
    backgroundImage: `url("${imageUrl.join('&')}")`,
    backgroundSize: `${width}px ${height}px`,
  };

  return (
    <a href={ href } target="_blank" className="GoogleStaticMap">
      <span style={ style } />
    </a>
  );
}

GoogleStaticMap.propTypes = {
  zoom: PropTypes.number,
  location: PropTypes.object.isRequired,
  center: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  markers: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  language: PropTypes.string,
  mapType: PropTypes.string,
};
