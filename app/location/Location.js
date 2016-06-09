import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import Card from '../ui/Card';
import GoogleStaticMap from '../location/GoogleStaticMap';
import { formatLocation } from '../utils/LocationUtils';

if (process.env.BROWSER) {
  require('./Location.scss');
}

export function Location({ location, style, zoom = 11, intl }) {
  return (
    <Card block className="Location" style={ style }>
      <GoogleStaticMap zoom={ zoom } location={ location } />
      <div className="Location-body">
        { formatLocation(location, { useAddress: true, locale: intl.locale }) }
      </div>
    </Card>
  );
}

Location.propTypes = {
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  style: PropTypes.object,
  zoom: PropTypes.number,
};

export default injectIntl(Location);
