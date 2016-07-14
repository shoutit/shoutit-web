import React, { Component, PropTypes } from 'react';

export default class BodyFixed extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  render() {
    return (
      <div className="ModalBodyFixed">
        { this.props.children }
      </div>
    );

  }
}
