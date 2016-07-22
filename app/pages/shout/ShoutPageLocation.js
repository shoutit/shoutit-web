import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getCurrentLocale } from '../../reducers/i18n';
import GoogleStaticMap from '../../location/GoogleStaticMap';
import { formatLocation } from '../../utils/LocationUtils';

class ShoutPageLocation extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    shout: PropTypes.object.isRequired,
  }
  render() {
    return (
      <div>
        <h2>
          <FormattedMessage id="shout.location" defaultMessage="Location" />
        </h2>
        <p>
          { formatLocation(this.props.shout.location, { useAddress: true, locale: this.props.locale }) }
        </p>
        <GoogleStaticMap location={ this.props.shout.location } />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});
export default connect(mapStateToProps)(ShoutPageLocation);
