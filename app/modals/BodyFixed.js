import React, { Component, PropTypes } from 'react';

export default class BodyFixed extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };


  getHeight() {
    return this.node.offsetHeight;
  }

  node = null;

  render() {
    return (
      <div className="ModalBodyFixed" ref={ el => { this.node = el; } }>
        { this.props.children }
      </div>
    );

  }
}
