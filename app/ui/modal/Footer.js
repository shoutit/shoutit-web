import React, { Component, PropTypes } from 'react';

export default class Footer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  render() {
    return (
      <div className="ModalFooter">
        { this.props.children }
      </div>
    );
  }
}
