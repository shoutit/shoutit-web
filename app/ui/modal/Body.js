import React, { Component, PropTypes } from 'react';

export default class Body extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  render() {
    return (
      <div className="ModalBody">
        { this.props.children }
      </div>
    );

  }
}
