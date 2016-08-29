import React, { PureComponent, PropTypes } from 'react';
import SimpleIcon from '../icons/SimpleIcon';

export default class ModalHeader extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    closeButton: PropTypes.bool,
    onCloseClick: PropTypes.func,
  };

  getHeight() {
    return this.node.offsetHeight;
  }

  node = null

  render() {
    return (
      <div className="ModalHeader" ref={ el => { this.node = el; } }>
        <span className="ModalHeader-content">
          { this.props.closeButton &&
            <span
              className="ModalHeader-close"
              tabIndex={ 0 }
              onClick={ this.props.onCloseClick }
              aria-label="Close" >
              <SimpleIcon name="close" />
            </span>
          }
          { this.props.children }
        </span>
      </div>
    );
  }
}
