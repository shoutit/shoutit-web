import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getCurrentUrl } from '../../reducers/routing';
import { getLocationPath } from '../../utils/LocationUtils';

import './Navbar.scss';

class Navbar extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }
  render() {
    const { location } = this.props;
    const country = location.country.toLowerCase();
    return (
      <div className="Navbar">
        <Link to={ `/search${getLocationPath(location)}` } activeClassName="active">
          <FormattedMessage id="layout.Navbar.browse" defaultMessage="Browse" />
        </Link>
        <Link to={ `/discover/${country}` } activeClassName="active">
          <FormattedMessage id="layout.Navbar.discover" defaultMessage="Discover" />
        </Link>
        <Link to="/chat" activeClassName="active">
          <FormattedMessage id="layout.Navbar.publicChats" defaultMessage="Public Chats" />
        </Link>
      </div>
    );
  }
}

// Connecting to current url is required to make the active class name working
// This should be solved when moving to a better router
const mapStateToProps = state => ({ currentUrl: getCurrentUrl(state) });
export default connect(mapStateToProps)(Navbar);
