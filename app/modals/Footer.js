import React, { Component, PropTypes } from 'react';

export default class Footer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  getHeight() {
    return this.node.offsetHeight;
  }

  node = null

  render() {
    return (
      <div className="ModalFooter" ref={ el => { this.node = el; } }>
        { this.props.children }
      </div>
    );
  }
}
