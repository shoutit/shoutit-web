import React, { PropTypes } from 'react';
import Card from '../ui/Card';
import GoogleStaticMap from '../location/GoogleStaticMap';

if (process.env.BROWSER) {
  require('./Location.scss');
}

export default function Location({ location }) {
  return (
    <Card block className="Location">
      <GoogleStaticMap zoom="11" location={ location } />
      <div className="Location-body">
        { location.city }
      </div>
    </Card>
  );
}

Location.propTypes = {
  location: PropTypes.object.isRequired,
};
