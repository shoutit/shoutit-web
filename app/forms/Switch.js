import React, { Component, PropTypes } from 'react';

import './Switch.scss';

export default class Switch extends Component {

  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, ...props } = this.props;
    const id = this.props.id || this.props.name;
    return (
      <label className="FormField Switch" htmlFor={ id }>
        <input
          { ...props }
          type="checkbox"
          name={ this.props.name }
          id={ id }
        />
        <span className="Switch-checkbox" />
        <span>
          { children }
        </span>
      </label>
    );
  }
}
