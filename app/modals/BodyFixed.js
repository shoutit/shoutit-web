import React, { PureComponent, PropTypes } from 'react';

export default class BodyFixed extends PureComponent {
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
