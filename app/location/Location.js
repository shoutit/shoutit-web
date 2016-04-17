import React, { PropTypes } from 'react';
import Card from '../ui/Card';
import GoogleStaticMap from '../location/GoogleStaticMap';
import { formatLocation } from '../utils/LocationUtils';

if (process.env.BROWSER) {
  require('./Location.scss');
}

export default function Location({ location, style }) {
  return (
    <Card block className="Location" style={ style }>
      <GoogleStaticMap zoom="11" location={ location } />
      <div className="Location-body">
        { formatLocation(location) }
      </div>
    </Card>
  );
}

Location.propTypes = {
  location: PropTypes.object.isRequired,
  style: PropTypes.object,
};
