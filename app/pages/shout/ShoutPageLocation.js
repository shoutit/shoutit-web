import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getCurrentLanguage } from '../../reducers/i18n';
import GoogleStaticMap from '../../location/GoogleStaticMap';
import { formatLocation } from '../../utils/LocationUtils';

class ShoutPageLocation extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    shout: PropTypes.object.isRequired,
  }
  render() {
    return (
      <div className="ShoutPage-Location">
        <h2>
          <FormattedMessage id="shout.location" defaultMessage="Location" />
        </h2>
        <p>
          { formatLocation(this.props.shout.location, { useAddress: true, language: this.props.language }) }
        </p>
        <GoogleStaticMap location={ this.props.shout.location } />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  language: getCurrentLanguage(state),
});
export default connect(mapStateToProps)(ShoutPageLocation);
