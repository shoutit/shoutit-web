import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import Icon from '../ui/Icon';

if (process.env.BROWSER) {
  require('./Button.scss');
}

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    action: PropTypes.oneOf(['default', 'primary', 'primary-alt', 'destructive']),
    size: PropTypes.oneOf(['small', 'medium']),
    icon: PropTypes.string,
    block: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    action: 'default',
    block: false,
  }

  focus() {
    this.refs.button.focus();
  }

  blur() {
    this.refs.button.blur();
  }

  render() {
    const { icon, children, action, size, block, ...attributes } = this.props;

    let className = `Button action-${action}`;
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
      <span className="Button-wrapper">
        { icon &&
          <span className="Button-icon">
            <Icon size={ size } name={ icon } fill />
          </span>
        }
        <span className="Button-label">
          { children }
        </span>
      </span>
    );

    if (attributes.to) {
      return (
        <Link {...attributes} className={ className } ref="button">
          { content }
        </Link>
      );
    }
    return (
      <button {...attributes} className={ className } ref="button">
        { content }
      </button>
    );
  }

}
