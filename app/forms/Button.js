import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import Icon from '../widgets/Icon';

import './Button.scss';

export default class Button extends Component {

  static propTypes = {
    block: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    element: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
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
    type: 'button',
  }

  constructor(props) {
    super(props);
    if (props.element === 'button') {
      this.state = {
        type: props.type,
      };
    }
  }

  componentDidMount() {
    if (this.props.element === 'button' && this.props.type === 'submit') {
      // Enable form submissions only when the component is mounted
      this.enableSubmit();
    }
  }

  node = null

  enableSubmit() {
    this.setState({
      type: 'submit',
    });
  }

  focus() {
    this.node.focus();
  }

  blur() {
    this.node.blur();
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

    const className = classNames(`Button ${kind}`, {
      'with-icon': !!icon,
      block: !!block,
      disabled: attributes.disabled,
    }, size ? `size-${size}` : null, attributes.className);

    const content = (
      <span>
        { icon &&
          <Icon size="small" name={ icon } fill={ kind !== 'default' } active={ kind === 'default' } />
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
    if (element === 'button') {
      attributes.type = this.state.type;
    }
    const props = {
      ...attributes,
      className,
      children: content,
      ref: el => this.node = el,
    };
    return React.createElement(elementClass, props);
  }

}
