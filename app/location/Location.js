import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import GoogleStaticMap from '../location/GoogleStaticMap';
import { formatLocation } from '../utils/LocationUtils';

import './Location.scss';

export function Location({ location, style, zoom = 11, locale }) {
  return (
    <div className="Location" style={ style }>
      <GoogleStaticMap zoom={ zoom } location={ location } />
      <div className="Location-body">
        { formatLocation(location, { useAddress: true, locale }) }
      </div>
    </div>
  );
}

Location.propTypes = {
  location: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  style: PropTypes.object,
  zoom: PropTypes.number,
};

const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(Location);
