import React, { Component, PropTypes } from "react";

import debug from "debug";

const log = debug("shoutit:ui:Scrollable");

// Use this component to detect when the user scrolls top/bottom of a container element

export default class Scrollable extends Component {

  static propTypes = {
    uniqueId: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
    onScroll: PropTypes.func,
    onScrollTop: PropTypes.func,
    onScrollBottom: PropTypes.func,
    initialScroll: PropTypes.oneOf(["top", "bottom"])
  };

  static defaultProps = {
    initialScroll: "top"
  };

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  state = {
    scrollHeight: null,
    scrollTop: 0
  };

  componentDidMount() {
    const scrollHeight = this.getScrollHeight();
    log("Component did mount: setting state.scrollHeight to %s", scrollHeight);
    this.setState({ scrollHeight }, this.scrollToInitialPosition);
  }


  componentDidUpdate(prevProps) {
    if (prevProps.uniqueId !== this.props.uniqueId) {
      const scrollHeight = this.getScrollHeight();
      log("Component unique id did change: setting state.scrollHeight to %s", scrollHeight);
      this.setState({ scrollHeight }, this.scrollToInitialPosition);
      return;
    }

    const scrollHeight = this.getScrollHeight();
    if (scrollHeight !== this.state.scrollHeight) {
      log("Component has a different scrollHeight %s (was %s)", this.state.scrollHeight, scrollHeight);
      this.refs.node.scrollTop = scrollHeight - this.state.scrollHeight + this.state.scrollTop;
      log("Set scrollTop to %s", this.refs.node.scrollTop);
      this.setState({ scrollHeight });
      return;
    }
  }

  getScrollHeight() {
    return this.refs.node.scrollHeight;
  }

  scrollToInitialPosition() {
    log("Scrolling to initial '%s' position", this.props.initialScroll);
    switch (this.props.initialScroll) {
    case "top":
      this.refs.node.scrollTop = 0;
      break;
    case "bottom":
      this.refs.node.scrollTop = this.state.scrollHeight;
      break;
    default:
      break;
    }
    log("Set scrollTop to %s", this.refs.node.scrollTop);
  }

  handleScroll(e) {
    e.persist();
    const { scrollTop, offsetHeight } = e.target;
    const { onScroll, onScrollTop, onScrollBottom } = this.props;
    if (onScroll) {
      onScroll(e);
    }
    if (onScrollTop && scrollTop === 0) {
      onScrollTop(e);
    } else if (onScrollBottom && scrollTop + offsetHeight >= this.state.scrollHeight) {
      onScrollBottom(e);
    }
    this.setState({ scrollTop });
  }

  render() {
    const { children, className, style } = this.props;
    return (
      <div ref="node" style={ style } className={ className } onScroll={ this.handleScroll }>
        { children }
      </div>
    );
  }

}
