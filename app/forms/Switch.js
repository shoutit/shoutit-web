import React, { Component, PropTypes } from 'react';

import './Switch.scss';

export default class Switch extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, ...props } = this.props;
    return (
      <div className="FormField Switch">
        <input
          { ...props }
          type="checkbox"
          name={ this.props.name }
          id={ this.props.name }
        />
        <span className="Switch-checkbox" />
        <label htmlFor={ this.props.name }>
          { children }
        </label>
      </div>
    );
  }
}
