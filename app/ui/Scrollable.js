import React, { Component, PropTypes } from 'react';

import debug from 'debug';

const log = debug('shoutit:ui:Scrollable');

// Use this component to detect when the user scrolls top/bottom of a container element

export default class Scrollable extends Component {

  static propTypes = {
    scrollElement: PropTypes.func,
    uniqueId: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number,
    ]),
    onScroll: PropTypes.func,
    onScrollTop: PropTypes.func,
    onScrollBottom: PropTypes.func,
    initialScroll: PropTypes.oneOf(['top', 'bottom']),
  };

  static defaultProps = {
    initialScroll: 'top',
    triggerOffset: 0,
  };

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  state = {
    scrollHeight: null,
    scrollTop: 0,
    didScrollToBottom: false,
  };

  componentDidMount() {
    const scrollHeight = this.getScrollHeight();
    log('Component did mount: setting state.scrollHeight to %s', scrollHeight);
    this.setState({ scrollHeight });
    this.getScrollElement().addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.uniqueId !== this.props.uniqueId) {
      const scrollHeight = this.getScrollHeight();
      log('Component unique id did change: setting state.scrollHeight to %s', scrollHeight);
      this.setState({ scrollHeight, didScrollToBottom: false }, this.scrollToInitialPosition);
      return;
    }

    const scrollHeight = this.getScrollHeight();
    if (scrollHeight !== this.state.scrollHeight) {
      log('Component has a different scrollHeight %s (was %s)', this.state.scrollHeight, scrollHeight);
      if (this.props.initialScroll === 'bottom') {
        this.getScrollable().scrollTop = scrollHeight - this.state.scrollHeight + this.state.scrollTop;
        log('Set scrollTop to %s', this.getScrollable().scrollTop);
      }
      this.setState({ scrollHeight, didScrollToBottom: false });
      return;
    }
  }

  componentWillUnmount() {
    this.getScrollElement().removeEventListener('scroll', this.handleScroll);
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
    return this.refs.node;
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

  scrollToInitialPosition() {
    log("Scrolling to initial '%s' position", this.props.initialScroll);
    switch (this.props.initialScroll) {
      case 'top':
        this.getScrollable().scrollTop = 0;
        break;
      case 'bottom':
        this.getScrollable().scrollTop = this.state.scrollHeight;
        break;
      default:
        break;
    }
    log('Set scrollTop to %s', this.getScrollable().scrollTop);
  }

  handleScroll(e) {
    const { scrollTop } = this.getScrollable();
    const offsetHeight = this.getOffsetHeight();
    const { scrollHeight, didScrollToBottom } = this.state;
    const { onScroll, onScrollTop, onScrollBottom, triggerOffset } = this.props;
    if (onScroll) {
      onScroll(e);
    }
    if (onScrollTop && scrollTop === 0) {
      log('Scrolled on top, call onScrollTop handler');
      onScrollTop(e);
    } else if (!didScrollToBottom && onScrollBottom && scrollTop + offsetHeight + triggerOffset >= scrollHeight) {
      log('Scrolled on bottom: call onScrollBottom handler (triggerOffset was %spx)', triggerOffset);
      this.setState({ didScrollToBottom: true }, () => onScrollBottom(e));
    }
    this.setState({ scrollTop });
  }

  render() {
    const { children, className, style } = this.props;
    return (
      <div ref="node" style={ style } className={ className }>
        { children }
      </div>
    );
  }

}
