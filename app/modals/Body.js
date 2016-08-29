import React, { PureComponent, PropTypes } from 'react';

export default class Body extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    preventInteraction: PropTypes.bool,
  };
  static defaultProps = {
    preventInteraction: false,
  }
  render() {
    return (
      <div className="ModalBody" style={ this.props.style }>
        { this.props.children }
        { this.props.preventInteraction && <div className="ModalBody-backdrop" /> }
      </div>
    );

  }
}
