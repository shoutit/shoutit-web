import React, { Component, PropTypes } from 'react';

export default class Body extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
  };

  getDOMNode() {
    return this.node;
  }

  render() {
    return (
      <div ref={ el => { this.node = el; } } className="ModalBody" style={ this.props.style }>
        { this.props.children }
      </div>
    );

  }
}
