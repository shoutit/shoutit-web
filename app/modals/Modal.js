/* eslint react/no-find-dom-node: 0 */
/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import debug from 'debug';
import classNames from 'classnames';

import Header from './Header';
import BodyFixed from './BodyFixed';
import Body from './Body';
import Footer from './Footer';
import Progress from '../widgets/Progress';

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
    loading: PropTypes.bool,
    leaveTimeout: PropTypes.number,
    autoSize: PropTypes.bool,
    enterAnimation: PropTypes.bool,
  }

  static defaultProps = {
    size: 'medium',
    scrollableBody: false,
    backdrop: true,
    closeButton: true,
    show: true,
    preventClose: false,
    autoSize: true,
    loading: false,
    enterAnimation: true,

    leaveTimeout: 250,
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
      didJustFinishToLoad: false,
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

  componentWillUpdate(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      this.setState({
        didJustFinishToLoad: true,
      }, () => {
        this.finishLoadTimeoutId = setTimeout(() =>
          this.setState({
            didJustFinishToLoad: false,
          }), 250);
      });
    }
  }

  componentWillUnmount() {
    preventBodyScroll().off();
    clearTimeout(this.leaveTimeoutId);
    clearTimeout(this.finishLoadTimeoutId);
    window.removeEventListener('keyup', this.handleWindowKeyup);
    if (this.props.autoSize) {
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  getHeaderHeight() {
    if (!this.header) {
      return 0;
    }
    return this.header.getHeight();
  }

  getBodyFixedHeight() {
    if (!this.bodyFixed) {
      return 0;
    }
    return this.bodyFixed.getHeight();
  }

  getBodyNode() {
    return ReactDOM.findDOMNode(this).getElementsByClassName('ModalBody')[0];
  }

  getFooterHeight() {
    if (!this.footer) {
      return 0;
    }
    return this.footer.getHeight();
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
  content = null

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
    if (this.content.contains(e.target)) {
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

  renderHeader() {
    const header = React.Children.toArray(this.props.children).find(child => child.type === Header);
    if (!header) {
      return undefined;
    }
    const props = {
      ref: el => { this.header = el; },
      onCloseClick: this.hide,
    };
    if (this.props.preventClose) {
      props.closeButton = false;
    }
    return React.cloneElement(header, props);
  }

  renderBodyFixed() {
    const bodyFixed = React.Children.toArray(this.props.children).find(child => child.type === BodyFixed);
    if (!bodyFixed) {
      return null;
    }
    return React.cloneElement(bodyFixed, { ref: el => { this.bodyFixed = el; } });
  }

  renderBody() {
    let body = React.Children.toArray(this.props.children).find(child => child.type === Body);
    if (body && this.props.autoSize) {
      body = React.cloneElement(body, {
        style: {
          ...body.props.style,
          ...this.state.bodyStyle,
        },
      });
    }
    return body;
  }

  renderFooter() {
    const footer = React.Children.toArray(this.props.children).find(child => child.type === Footer);
    if (!footer) {
      return null;
    }
    return React.cloneElement(footer, { ref: el => { this.footer = el; } });
  }

  render() {
    const modalClassName = classNames('Modal', {
      loading: this.props.loading,
      enterAnimation: this.props.enterAnimation,
      'scrollable-body': this.props.scrollableBody,
      didJustFinishToLoad: this.state.didJustFinishToLoad,
    });
    const backdropClassName = classNames('Modal-backdrop', {
      enterAnimation: this.props.enterAnimation,
    });

    const style = {};
    if (this.props.loading) {
      style.width = 200;
    } else {
      switch (this.props.size) {
        case 'medium':
          style.width = 550;
          break;
        case 'small':
          style.width = 450;
          break;
        case 'x-small':
          style.width = 385;
          break;
        default:
          style.width = 550;
          break;
      }
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="Modal-animation"
        transitionEnterTimeout={ 0 }
        transitionLeaveTimeout={ 300 }>

        { this.state.show &&
          <div role="dialog" key="dialog">
            <div key="backdrop" className={ backdropClassName } />
            <div
              className={ modalClassName }
              role="dialog"
              onClick={ this.handleBackdropClick }>
              <div className="Modal-dialog" style={ style }>
                <div
                  ref={ el => { this.content = el; } }
                  className="Modal-content"
                  tabIndex={ 0 }
                  style={ { top: this.state.contentTop } }>
                  { this.props.loading && <Progress animate /> }
                  { this.renderHeader() }
                  { this.renderBodyFixed() }
                  { this.renderBody() }
                  { this.renderFooter() }
                </div>
              </div>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    );
  }
}
