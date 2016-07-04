import React, { PropTypes, Component } from 'react';
import './ResponsiveLayout.scss';

class ResponsiveLayout extends Component {
  static propTypes = {
    constrainMaxWidth: PropTypes.bool.isRequired,
    constrainMinWidth: PropTypes.bool.isRequired,
    children: PropTypes.element,
  }
  static defaultProps = {
    constrainMaxWidth: true,
    constrainMinWidth: false,
  }
  render() {
    let className = 'ResponsiveLayout';
    if (this.props.constrainMaxWidth) {
      className += ' max-width';
    }
    if (this.props.constrainMinWidth) {
      className += ' min-width';
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
