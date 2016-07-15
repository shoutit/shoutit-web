import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { imagesPath } from '../../config';

// import './Toolbar.scss';

class Location extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onLocationClick: PropTypes.func.isRequired,
  }
  render() {
    return (
      <div className="Header-logo">
        <Link to="/">
          <img alt="" height="36" width="113" src={ `${imagesPath}/logo.png` } />
        </Link>
      </div>
    );
  }
}

export default Location;
