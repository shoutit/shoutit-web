import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import Icon from '../ui/Icon';

import './Button.scss';

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    kind: PropTypes.oneOf(['default', 'primary', 'primary-alt', 'destructive', 'inverted']),
    size: PropTypes.oneOf(['small', 'medium']),
    icon: PropTypes.string,
    block: PropTypes.bool,
    className: PropTypes.string,
    element: PropTypes.string,
  }

  static defaultProps = {
    kind: 'default',
    block: false,
    element: 'button',
  }

  focus() {
    this.refs.button.focus();
  }

  blur() {
    this.refs.button.blur();
  }

  render() {
    const { icon, children, kind, size, block, ...attributes } = this.props;

    let className = `Button ${kind}`;
    if (icon) {
      className += ' with-icon';
    }
    if (block) {
      className += ' block';
    }
    if (attributes.disabled) {
      className += ' disabled';
    }
    if (size) {
      className += ` size-${size}`;
    }
    if (attributes.className) {
      className += ` ${attributes.className}`;
    }
    const content = (
      <span>
        { icon &&
          <Icon name={ icon } fill={ kind !== 'default' } active={ kind === 'default' } />
        }
        <span className="Button-label">
          { children }
        </span>
      </span>
    );

    let { element } = this.props;
    if (attributes.to) {
      element = Link;
    }
    return React.createElement(element, {
      ...attributes,
      className,
      children: content,
      ref: 'button',
    });
  }

}
