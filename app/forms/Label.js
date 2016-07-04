import React, { Component, PropTypes } from 'react';
import './Label.scss';

class Label extends Component {
  static propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.element,
    maxLength: PropTypes.number,
    currentLength: PropTypes.number,
  }
  render() {
    return (
      <label className="Label" htmlFor={ this.props.htmlFor }>
        <span className="Label-content">
          { this.props.children }
        </span>
        { this.props.maxLength &&
          <span className="Label-max-length">
            { `${this.props.currentLength}/${this.props.maxLength}` }
          </span>
        }
      </label>
    );
  }
}

export default Label;
