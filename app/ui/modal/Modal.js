import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import debug from 'debug';

import Header from './Header';
import BodyFixed from './BodyFixed';
import Body from './Body';
import Footer from './Footer';

import { preventBodyScroll } from '../../utils/DOMUtils';
import { ESCAPE } from '../../utils/keycodes';

const log = debug('shoutit:ui:Modal');

export default class Modal extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['medium', 'small', 'x-small', 'large']),
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

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.handleWindowKeyup = this.handleWindowKeyup.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.state = {
      show: props.show,
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

  getHeader() {
    const header = React.Children.toArray(this.props.children).find(child => child.type === Header);
    if (!header) {
      return undefined;
    }
    const props = {
      onCloseClick: this.hide,
    };
    if (this.props.preventClose) {
      props.closeButton = false;
    }
    return React.cloneElement(header, props);
  }

  getBodyFixed() {
    return React.Children.toArray(this.props.children).find(child => child.type === BodyFixed);
  }

  getBody() {
    return React.Children.toArray(this.props.children).find(child => child.type === Body);
  }

  getFooter() {
    return React.Children.toArray(this.props.children).find(child => child.type === Footer);
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
                  { this.getBodyFixed() }
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
