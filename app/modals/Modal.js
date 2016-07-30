/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import debug from 'debug';

import Header from './Header';
import BodyFixed from './BodyFixed';
import Body from './Body';
import Footer from './Footer';

import { preventBodyScroll } from '../utils/DOMUtils';
import { ESCAPE } from '../utils/keycodes';

const log = debug('shoutit:ui:Modal');

const CONTENT_TOP_SMALL = 40;
const CONTENT_TOP_SMALL_TRIGGER = 650; // how much should window be small to use small content's top
const CONTENT_TOP_DEFAULT = 100;
const CONTENT_TOP_LARGE = 200;
const CONTENT_TOP_LARGE_TRIGGER = 1050; // how much should window be small to use small content's top
const MARGIN_BOTTOM = 75;
const BODY_MAX_HEIGHT = 600;

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
    autoSize: PropTypes.bool,
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
    autoSize: true,

    leaveTimeout: 250,
    enterTimeout: 0,
  }

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.handleWindowKeyup = this.handleWindowKeyup.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.state = {
      show: props.show,
      contentTop: props.autoSize ? CONTENT_TOP_DEFAULT : 0,
      bodyStyle: null,
    };
  }

  componentDidMount() {
    preventBodyScroll().on();
    window.addEventListener('keyup', this.handleWindowKeyup);
    if (this.props.autoSize) {
      window.addEventListener('resize', this.handleWindowResize);
      this.setSize();
    }
  }

  componentWillUnmount() {
    preventBodyScroll().off();
    clearTimeout(this.leaveTimeoutId);
    window.removeEventListener('keyup', this.handleWindowKeyup);
    if (this.props.autoSize) {
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  getHeader() {
    const header = React.Children.toArray(this.props.children).find(child => child.type === Header);
    if (!header) {
      return undefined;
    }
    const props = {
      ref: 'header',
      onCloseClick: this.hide,
    };
    if (this.props.preventClose) {
      props.closeButton = false;
    }
    return React.cloneElement(header, props);
  }

  getHeaderHeight() {
    if (!this.refs.header) {
      return 0;
    }
    return ReactDOM.findDOMNode(this.refs.header).offsetHeight;
  }

  getBodyFixed() {
    const bodyFixed = React.Children.toArray(this.props.children).find(child => child.type === BodyFixed);
    if (!bodyFixed) {
      return null;
    }
    return React.cloneElement(bodyFixed, { ref: 'bodyFixed' });
  }

  getBodyFixedHeight() {
    if (!this.refs.bodyFixed) {
      return 0;
    }
    return ReactDOM.findDOMNode(this.refs.bodyFixed).offsetHeight;
  }

  getBody() {
    let body = React.Children.toArray(this.props.children).find(child => child.type === Body);
    if (body && this.props.autoSize) {
      body = React.cloneElement(body, {
        style: this.state.bodyStyle,
      });
    }
    return body;
  }

  getFooter() {
    const footer = React.Children.toArray(this.props.children).find(child => child.type === Footer);
    if (!footer) {
      return null;
    }
    return React.cloneElement(footer, { ref: 'footer' });
  }

  getFooterHeight() {
    if (!this.refs.footer) {
      return 0;
    }
    return ReactDOM.findDOMNode(this.refs.footer).offsetHeight;
  }

  setSize() {
    const newState = {};
    const documentHeight = window.innerHeight;
    if (documentHeight < CONTENT_TOP_SMALL_TRIGGER) {
      newState.contentTop = CONTENT_TOP_SMALL;
    } else if (documentHeight > CONTENT_TOP_LARGE_TRIGGER) {
      newState.contentTop = CONTENT_TOP_LARGE;
    } else {
      newState.contentTop = CONTENT_TOP_DEFAULT;
    }
    if (this.props.autoSize) {
      let maxHeight = documentHeight - newState.contentTop - MARGIN_BOTTOM - this.getHeaderHeight() - this.getBodyFixedHeight() - this.getFooterHeight();
      if (maxHeight > BODY_MAX_HEIGHT) {
        maxHeight = BODY_MAX_HEIGHT;
      }
      newState.bodyStyle = { maxHeight };
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
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

  handleWindowResize() {
    this.setSize();
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
                <div
                  ref="content"
                  className="Modal-content"
                  tabIndex={ 0 }
                  style={ { top: this.state.contentTop } }>
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
