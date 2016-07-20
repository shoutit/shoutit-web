import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import Icon from '../widgets/Icon';

import './Button.scss';

export default class Button extends Component {

  static propTypes = {
    block: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    element: PropTypes.string,
    icon: PropTypes.string,
    iconButton: PropTypes.bool,
    kind: PropTypes.oneOf(['default', 'primary', 'secondary', 'alternate', 'destructive', 'inverted', 'social']),
    size: PropTypes.oneOf(['small', 'medium']),
    startElement: PropTypes.element,
  }

  static defaultProps = {
    kind: 'default',
    block: false,
    iconButton: false,
    element: 'button',
  }

  focus() {
    this.refs.button.focus();
  }

  blur() {
    this.refs.button.blur();
  }

  render() {
    const {
      block,
      children,
      element,
      icon,
      iconButton,
      kind,
      size,
      startElement,
      ...attributes,
    } = this.props;

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
        { startElement &&
          <span className="Button-start">
            { startElement }
          </span>
        }
        { iconButton ?
          <span className="Button-icon">
            { children }
          </span> :
          <span className="Button-label">
            { children }
          </span>
        }
      </span>
    );

    let elementClass = element;
    if (attributes.to) {
      elementClass = Link;
    }
    return React.createElement(elementClass, {
      ...attributes,
      className,
      children: content,
      ref: 'button',
    });
  }

}
