/* eslint-env browser */

import React, { PropTypes, Component } from 'react';

import Overlay from 'react-bootstrap/lib/Overlay';
import RBPopover from 'react-bootstrap/lib/Popover';

export default class Popover extends Component {

  static opened = {};

  static propTypes = {
    trigger: PropTypes.array,
    children: PropTypes.element.isRequired,
    delay: PropTypes.number,
    delayHide: PropTypes.number,
    positionTop: PropTypes.number,
    topOffset: PropTypes.number,
    placement: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
    show: PropTypes.bool,
    overlay: PropTypes.node,
  };

  static defaultProps = {
    delay: 0,
    delayHide: 300,
    placement: 'top',
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
    this.state = {
      show: props.show || false,
      placement: props.placement,
      positionTop: props.positionTop,
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

  adjustPlacement(node) {
    let { placement } = this.props;
    const { width, height } = node.getBoundingClientRect();
    const { top: targetTop, right: targetRight } = this.refs.target.getBoundingClientRect();
    const { right: maxRight } = document.getElementsByClassName('Application-content')[0].getBoundingClientRect();

    if (placement === 'top' || placement === 'bottom') {
      // adjust vertical position
      if (targetTop - height < this.props.topOffset) {
        placement = 'bottom';
      } else {
        placement = 'top';
      }
    } else if (targetRight + width > maxRight) {
      placement = 'left';
    } else {
      placement = 'right';
    }

    this.setState({ width, height, placement });

  }

  handleMouseEnter() {
    this.showInterval = setTimeout(() => this.show(), this.props.delay);
  }

  handleMouseLeave(e) {
    const target = e.currentTarget;
    const related = e.relatedTarget || e.nativeEvent.toElement;
    if (related === target || (related !== window && target.contains(related))) {
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
    this.adjustPlacement(node);
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
          { ...props }
          onHide={ this.handleOverlayHide }
          onEnter={ this.handleOverlayEnter }
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
