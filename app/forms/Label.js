import React, { Component, PropTypes } from 'react';
import { FormattedNumber } from 'react-intl';

import SimpleIcon from '../icons/SimpleIcon';
import Tooltip from '../widgets/Tooltip';

import './Label.scss';

class Label extends Component {
  static propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.node,
    maxLength: PropTypes.number,
    currentLength: PropTypes.number,
    tooltip: PropTypes.string,
  }
  render() {
    return (
      <label className="Label" htmlFor={ this.props.htmlFor }>
        <span className="Label-content">
          { this.props.children }
          { this.props.tooltip &&
            <Tooltip overlay={ this.props.tooltip } placement="right">
              <SimpleIcon name="info" size="small" />
            </Tooltip>
          }
        </span>
        { this.props.maxLength &&
          <span className="Label-max-length">
            <FormattedNumber value={ this.props.currentLength } />
            /
            <FormattedNumber value={ this.props.maxLength } />
          </span>
        }
      </label>
    );
  }
}

export default Label;
