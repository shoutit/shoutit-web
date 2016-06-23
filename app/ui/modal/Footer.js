import React, { Component, PropTypes } from 'react';

export default class Footer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    start: PropTypes.node,
  };
  render() {
    return (
      <div className="ModalFooter">
        { this.props.start &&
          <div className="ModalFooter-start">
            { this.props.start }
          </div>
        }
        <div className="ModalFooter-end">
          { this.props.children }
        </div>
      </div>
    );
  }
}
