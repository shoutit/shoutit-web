import React, { PropTypes, Component } from 'react';
import './ResponsiveLayout.scss';

class ResponsiveLayout extends Component {
  static propTypes = {
    constrainMaxWidth: PropTypes.bool.isRequired,
    constrainMinWidth: PropTypes.bool.isRequired,
    horizontalSpace: PropTypes.bool,
    fullHeight: PropTypes.bool,
    children: PropTypes.node,
    size: PropTypes.oneOf(['default', 'small']),
  }
  static defaultProps = {
    constrainMaxWidth: true,
    constrainMinWidth: false,
    horizontalSpace: true,
    size: 'default',
  }
  render() {
    let className = `ResponsiveLayout ${this.props.size}`;
    if (this.props.constrainMaxWidth) {
      className += ' max-width';
    }
    if (this.props.constrainMinWidth) {
      className += ' min-width';
    }
    if (this.props.horizontalSpace) {
      className += ' horizontal-space';
    }
    if (this.props.fullHeight) {
      className += ' full-height';
    }
    return (
      <div className={ className }>
        <span>
          { this.props.children }
        </span>
      </div>
    );
  }
}

export default ResponsiveLayout;
