/* eslint-env browser */
import React, { Component, PropTypes } from 'react';
import debug from 'debug';
import throttle from 'lodash/throttle';

import { preventBodyScroll, getDocumentScrollTop } from '../utils/DOMUtils';

const log = debug('shoutit:ui:Scrollable');

// Use this component to detect when the user scrolls top/bottom of a container element

export default class Scrollable extends Component {

  static propTypes = {
    scrollElement: PropTypes.func,
    children: PropTypes.node.isRequired,
    uniqueId: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number,
    ]),
    onScroll: PropTypes.func,
    onScrollTop: PropTypes.func,
    onScrollBottom: PropTypes.func,
    initialScroll: PropTypes.oneOf(['top', 'bottom']),
    preventDocumentScroll: PropTypes.bool,
    triggerOffset: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    initialScroll: 'top',
    triggerOffset: 10, // for some reasons a small offset is required to detect the scroll to the bottom
    preventDocumentScroll: false,
  };

  constructor(props) {
    super(props);
    this.handleScroll = throttle(this.handleScroll, 100).bind(this);
    if (props.preventDocumentScroll) {
      this.handleMouseEnter = this.handleMouseEnter.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }
  }

  state = {
    scrollHeight: null,
    scrollTop: 0,
    didScrollToBottom: false,
  };

  componentDidMount() {
    const scrollHeight = this.getScrollHeight();
    const scrollElement = this.getScrollElement();
    log('Component did mount: setting state.scrollHeight to %s', scrollHeight, scrollElement);
    this.setState({ scrollHeight }, this.scrollToInitialPosition); // eslint-disable-line
    scrollElement.addEventListener('scroll', this.handleScroll);

    if (this.props.preventDocumentScroll) {
      scrollElement.addEventListener('mouseenter', this.handleMouseEnter);
      scrollElement.addEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  componentDidUpdate(prevProps) {
    const scrollHeight = this.getScrollHeight();

    if (prevProps.uniqueId !== this.props.uniqueId) {
      log('Component unique id did change: setting state.scrollHeight to %s', scrollHeight);
      this.setState({ scrollHeight, didScrollToBottom: false }, this.scrollToInitialPosition); // eslint-disable-line
      return;
    }

    if (scrollHeight !== this.state.scrollHeight) {
      log('Component has a different scrollHeight %s (was %s)', this.state.scrollHeight, scrollHeight);
      if (this.props.initialScroll === 'bottom') {
        const scrollable = this.getScrollable();
        scrollable.scrollTop = (scrollHeight - this.state.scrollHeight) + this.state.scrollTop;
        log('Set scrollTop to %s', scrollable.scrollTop);
      }
      this.setState({ scrollHeight, didScrollToBottom: false }); // eslint-disable-line
      return;
    }
  }

  componentWillUnmount() {
    const scrollElement = this.getScrollElement();
    scrollElement.removeEventListener('scroll', this.handleScroll);
    if (this.props.preventDocumentScroll) {
      scrollElement.removeEventListener('mouseenter', this.handleMouseEnter);
      scrollElement.removeEventListener('mouseleave', this.handleMouseLeave);
      preventBodyScroll().off();
    }
  }

  getScrollable() {
    const scrollElement = this.getScrollElement();
    if (scrollElement === window) {
      return document.body;
    }
    return scrollElement;
  }

  getScrollElement() {
    if (this.props.scrollElement) {
      return this.props.scrollElement();
    }
    return this.node;
  }

  getScrollHeight() {
    return this.getScrollable().scrollHeight;
  }

  getOffsetHeight() {
    const scrollElement = this.getScrollElement();
    if (scrollElement === window) {
      return document.documentElement.clientHeight;
    }
    return scrollElement.offsetHeight;
  }

  getScrollTop() {
    const scrollElement = this.getScrollElement();
    if (scrollElement === window) {
      return getDocumentScrollTop();
    }
    return scrollElement.scrollTop;
  }

  canScroll() {
    return this.getScrollHeight() > this.getOffsetHeight();
  }

  handleMouseEnter() {
    preventBodyScroll().on();
  }

  handleMouseLeave() {
    preventBodyScroll().off();
  }

  scrollToInitialPosition() {
    if (this.props.initialScroll === 'bottom') {
      log("Scrolling to initial '%s' position", this.props.initialScroll);
      this.getScrollable().scrollTop = this.state.scrollHeight;
      log('Set scrollTop to %s', this.getScrollable().scrollTop);
    }
  }

  handleScroll(e) {
    const scrollTop = this.getScrollTop();
    const offsetHeight = this.getOffsetHeight();
    const { scrollHeight, didScrollToBottom } = this.state;
    const { onScroll, onScrollTop, onScrollBottom, triggerOffset } = this.props;
    if (onScroll) {
      onScroll(e);
    }

    // log('Scrolling... scrollTop: %s, offsetHeight: %s, triggerOffset: %s, scrollHeight: %s', scrollTop, offsetHeight, triggerOffset, scrollHeight);

    if (onScrollTop && scrollTop === 0) {
      log('Scrolled on top, call onScrollTop handler');
      onScrollTop(e);
      return;
    }
    const isAtBottom = scrollTop + offsetHeight + triggerOffset >= scrollHeight;
    // log('isAtBottom', isAtBottom, didScrollToBottom, onScrollBottom);
    if (!didScrollToBottom && !!onScrollBottom && isAtBottom) {
      log('Scrolled to the bottom: call onScrollBottom handler (triggerOffset was %spx)', triggerOffset);
      this.setState({ didScrollToBottom: true }, () => onScrollBottom(e));
    }
    this.setState({ scrollTop });
  }

  render() {
    return (
      <div
        ref={ el => this.node = el }
        style={ this.props.style }
        className={ this.props.className }>
        { this.props.children }
      </div>
    );
  }

}
