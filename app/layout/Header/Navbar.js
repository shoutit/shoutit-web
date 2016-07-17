import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getCurrentUrl } from '../../reducers/routing';
import { getLocationPath } from '../../utils/LocationUtils';

import './Navbar.scss';

function getDiscoverLink(location) {
  let link = '/discover';
  if (location.country) {
    link += `/${location.country.toLowerCase()}`;
  }
  return link;
}

class Navbar extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }
  render() {
    return (
      <div className="Navbar">
        <Link to={ `/search${getLocationPath(this.props.location)}` } activeClassName="active">
          <FormattedMessage id="layout.Navbar.browse" defaultMessage="Browse" />
        </Link>
        <Link to={ getDiscoverLink(this.props.location) } activeClassName="active" >
          <FormattedMessage id="layout.Navbar.discover" defaultMessage="Discover" />
        </Link>
      </div>
    );
  }
}

// Connecting to current url is required to make the active class name working
// This should be solved when moving to a bette router
const mapStateToProps = state => ({ currentUrl: getCurrentUrl(state) });
export default connect(mapStateToProps)(Navbar);
