import React, { PropTypes, Component } from 'react';
import contains from 'dom-helpers/query/contains';

import Overlay from 'react-bootstrap/lib/Overlay';
import RBPopover from 'react-bootstrap/lib/Popover';

export default class Popover extends Component {

  static opened = {};
  static propTypes = {
    trigger: PropTypes.array,
    children: PropTypes.element.isRequired,
    delay: PropTypes.number,
    delayHide: PropTypes.number,
    topOffset: PropTypes.number,
    placement: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
    show: PropTypes.bool,
    overlay: PropTypes.node,
  };

  static defaultProps = {
    delay: 0,
    delayHide: 200,
    placement: 'auto',
    topOffset: 75,
    id: 'popover',
  }

  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handlePopoverMouseEnter = this.handlePopoverMouseEnter.bind(this);
    this.handlePopoverMouseLeave = this.handlePopoverMouseLeave.bind(this);
    this.handleOverlayHide = this.handleOverlayHide.bind(this);
    this.handleOverlayEnter = this.handleOverlayEnter.bind(this);
    this.handleOverlayEntered = this.handleOverlayEntered.bind(this);
    this.state = {
      show: props.show || false,
      placement: props.placement === 'auto' ? 'top' : props.placement,
      width: 0,
      height: 0,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.hideInterval);
    clearTimeout(this.showInterval);
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false });
  }

  adjustPosition(node) {
    if (this.props.placement !== 'auto') {
      return;
    }
    let placement = 'top';

    const { width, height } = node.getBoundingClientRect();
    const { top } = this.refs.target.getBoundingClientRect();

    if (top - height < this.props.topOffset) {
      placement = 'bottom';
    } else {
      placement = 'top';
    }
    this.setState({ width, height, placement });

  }

  handleMouseEnter() {
    this.showInterval = setTimeout(() => this.show(), this.props.delay);
  }

  handleMouseLeave(e) {
    const target = e.currentTarget;
    const related = e.relatedTarget || e.nativeEvent.toElement;
    if (related === target || (related !== window && contains(target, related))) {
      return;
    }
    clearTimeout(this.showInterval);
    this.hideInterval = setTimeout(() => {
      this.hide();
    }, this.props.delayHide);
  }

  handlePopoverMouseEnter() {
    clearTimeout(this.hideInterval);
    this.show();
  }

  handlePopoverMouseLeave() {
    this.hide();
  }

  handleOverlayEnter(node) {
    const { id } = this.props;
    if (Popover.opened[id] && Popover.opened[id] !== this) {
      Popover.opened[id].hide();
    }
    Popover.opened = {
      [id]: this,
    };

    node.addEventListener('mouseenter', this.handlePopoverMouseEnter);
    node.addEventListener('mouseleave', this.handlePopoverMouseLeave);
    node.addEventListener('click', this.handlePopoverClick);
    this.adjustPosition(node);
  }

  handleOverlayEntered(node) {

  }

  handleOverlayHide() {
    delete Popover.opened[this.id];
  }

  render() {
    const { children, overlay, title, id, ...props } = this.props;
    return (
      <span
        ref="target"
        style={ { position: 'relative', display: 'inline-block' } }
        onMouseEnter={ this.handleMouseEnter }
        onMouseLeave={ this.handleMouseLeave }>
        { children }
        <Overlay
          {...props }
          onHide={ this.handleOverlayHide }
          onEnter={ this.handleOverlayEnter }
          onEntered={ this.handleOverlayEntered }
          show={ this.state.show }
          target={ () => this.refs.target }
          placement={ this.state.placement }
        >
          <RBPopover id={ id } title={ title } ref="overlay">
            { overlay }
          </RBPopover>
        </Overlay>
      </span>

    );
  }

}
