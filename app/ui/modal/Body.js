import React, { Component, PropTypes } from 'react';

export default class Body extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
  };
  render() {
    return (
      <div className="ModalBody" style={ this.props.style }>
        { this.props.children }
      </div>
    );

  }
}
