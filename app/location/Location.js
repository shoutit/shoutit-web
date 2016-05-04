import React, { PropTypes } from 'react';
import Card from '../ui/Card';
import GoogleStaticMap from '../location/GoogleStaticMap';
import { formatLocation } from '../utils/LocationUtils';

if (process.env.BROWSER) {
  require('./Location.scss');
}

export default function Location({ location, style, zoom = 11 }) {
  return (
    <Card block className="Location" style={ style }>
      <GoogleStaticMap zoom={ zoom } location={ location } />
      <div className="Location-body">
        { formatLocation(location, { useAddress: true }) }
      </div>
    </Card>
  );
}

Location.propTypes = {
  location: PropTypes.object.isRequired,
  style: PropTypes.object,
  zoom: PropTypes.number,
};
