import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import './Logo.scss';

class Logo extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['business']),
  }
  render() {
    return (
      <span className={ `Logo ${this.props.type}` }>
      { this.props.type === 'business' &&
        <span className="Logo-text">
          <FormattedMessage
            id="widgets.logo.businessText"
            defaultMessage="for Businesses"
          />
        </span>
      }
      </span>
    );
  }
}

export default Logo;
