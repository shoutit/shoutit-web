import React, { Component, PropTypes } from 'react';
import Icon from '../widgets/Icon';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    closeButton: PropTypes.bool,
    onCloseClick: PropTypes.func,
  };

  render() {
    return (
      <div className="ModalHeader">
        <span className="ModalHeader-content">
          { this.props.children }
        </span>
        { this.props.closeButton &&
          <span className="ModalHeader-close" tabIndex={ 0 } onClick={ this.props.onCloseClick } aria-label="Close" >
            <Icon name="close" size="x-small" />
          </span>
        }
      </div>
    );
  }
}
