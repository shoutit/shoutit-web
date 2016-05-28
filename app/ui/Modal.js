import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import debug from 'debug';
import { preventBodyScroll } from '../utils/DOMUtils';

import { ESCAPE } from '../utils/keycodes';

const log = debug('shoutit:ui:Modal');

if (process.env.BROWSER) {
  require('./Modal.scss');
}

export function Header({ children, closeButton, onCloseButtonClick }) {
  return (
    <div className="ModalHeader">
      <div className="ModalHeader-content">
        { children }
      </div>
      { closeButton &&
        <div className="ModalHeader-close">
          <span tabIndex={ 0 } onClick={ onCloseButtonClick } aria-label="Close">
            ×
          </span>
        </div>
      }
    </div>
  );
}
Header.propTypes = {
  children: PropTypes.node.isRequired,
  closeButton: PropTypes.bool,
  onCloseButtonClick: PropTypes.func,
};

export function Body({ children }) {
  return (
    <div className="Modal-body">
      { children }
    </div>
  );
}
Body.propTypes = {
  children: PropTypes.node.isRequired,
};

export function Footer({ children }) {
  return (
    <div className="ModalFooter">
      { children }
    </div>
  );
}
Footer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default class Modal extends Component {

  static defaultProps = {
    size: 'medium',
    scrollableBody: false,
    backdrop: true,
    closeButton: true,
    show: true,
    preventClose: false,
    buttons: [],

    leaveTimeout: 250,
    enterTimeout: 0,
  }

  static propTypes = {
    size: PropTypes.oneOf(['medium', 'small', 'large']),
    scrollableBody: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.node,
    closeButton: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    preventClose: PropTypes.bool,
    leaveTimeout: PropTypes.number,
    enterTimeout: PropTypes.number,
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        close: PropTypes.bool,
      })
    ),
  }

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.handleWindowKeyup = this.handleWindowKeyup.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.state = {
      show: this.props.show,
    };
  }

  componentDidMount() {
    preventBodyScroll().on();
    window.addEventListener('keyup', this.handleWindowKeyup);
  }

  componentWillUnmount() {
    preventBodyScroll().off();
    clearTimeout(this.leaveTimeoutId);
    window.removeEventListener('keyup', this.handleWindowKeyup);
  }

  getFooter() {
    return React.Children.toArray(this.props.children).find(child => child.type === Footer);
  }

  getBody() {
    return React.Children.toArray(this.props.children).find(child => child.type === Body);
  }

  getHeader() {
    const header = React.Children.toArray(this.props.children).find(child => child.type === Header);
    if (!header) {
      return undefined;
    }
    const props = {
      onCloseButtonClick: this.hide,
    };
    if (this.props.preventClose) {
      props.closeButton = false;
    }
    return React.cloneElement(header, props);
  }

  leaveTimeoutId = null

  hide() {
    log('Hiding modal...');
    this.setState({ show: false }, () => {
      if (this.props.onHide) {
        log('Calling hide handler after %sms...', this.props.leaveTimeout);
        this.leaveTimeoutId = setTimeout(
          this.props.onHide,
          this.props.leaveTimeout
        );
      }
    });
  }

  handleWindowKeyup(e) {
    if (e.keyCode === ESCAPE) {
      if (this.props.preventClose) {
        log('Ignoring ESC press as prevent close is enabled');
        return;
      }
      log('Hiding modal after pressing ESCAPE');
      e.preventDefault();
      this.hide();
    }
  }
  handleBackdropClick(e) {
    if (this.refs.content.contains(e.target)) {
      log('Ignoring backdrop click since the clicked element is the modal content');
      return;
    }
    if (this.props.preventClose) {
      log('Ignoring backdrop click as prevent close is enabled');
      return;
    }
    log('Backdrop has been clicked');
    this.hide();
  }

  render() {

    let modalClassName = `Modal size-${this.props.size}`;

    if (this.props.scrollableBody) {
      modalClassName += ' scrollable-body';
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="Modal-animation"
        transitionEnterTimeout={ 0 }
        transitionLeaveTimeout={ 300 }>

        { this.state.show &&
          <div role="dialog" key="dialog">
            <div key="backdrop" className="Modal-backdrop" />
            <div
              className={ modalClassName }
              role="dialog"
              onClick={ this.handleBackdropClick }>
              <div className="Modal-dialog">
                <div className="Modal-content" ref="content" tabIndex={ 0 }>
                  { this.getHeader() }
                  { this.getBody() }
                  { this.getFooter() }
                </div>
              </div>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    );
  }
}
