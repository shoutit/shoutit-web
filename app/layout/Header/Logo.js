import React, { Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_PATH } from '../../config';

class Logo extends Component {
  render() {
    return (
      <div className="Header-logo">
        <Link to="/">
          <img alt="" height="36" width="113" src={ `${IMAGES_PATH}/logo.svg?v2` } />
        </Link>
      </div>
    );
  }
}

export default Logo;
