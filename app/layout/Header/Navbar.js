import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

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

export default Navbar;
