import React, { Component, PropTypes } from "react";

// Use this component to detect when the user scrolls top/bottom of a container element

export default class Scrollable extends Component {

  static propTypes = {
    uniqueId: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
    children: PropTypes.element.isRequired,
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
    contentHeight: null,
    scrollTop: 0
  };

  componentDidMount() {
    this.scrollToInitialPosition();
    const contentHeight = this.getContentHeight();
    this.setState({ contentHeight });
  }


  componentDidUpdate(prevProps) {
    if (prevProps.uniqueId !== this.props.uniqueId) {
      this.scrollToInitialPosition();
      return;
    }

    const contentHeight = this.getContentHeight();
    if (contentHeight !== this.state.contentHeight) {
      this.refs.node.scrollTop = contentHeight - this.state.contentHeight + this.state.scrollTop;
      this.setState({ contentHeight });
      return;
    }
  }

  getContentHeight() {
    return this.refs.node.scrollHeight;
  }

  scrollToInitialPosition() {
    const node = this.refs.node;
    switch (this.props.initialScroll) {
    case "top":
      node.scrollTop = 0;
      break;
    case "bottom":
      node.scrollTop = node.scrollHeight;
      break;
    default:
      break;
    }
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
    } else if (onScrollBottom && scrollTop + offsetHeight >= this.state.contentHeight) {
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
