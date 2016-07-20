import React, { Component } from 'react';
import { Link } from 'react-router';
import { imagesPath } from '../../config';

class Logo extends Component {
  render() {
    return (
      <div className="Header-logo">
        <Link to="/">
          <img alt="" height="36" width="113" src={ `${imagesPath}/logo.svg?v2` } />
        </Link>
      </div>
    );
  }
}

export default Logo;
