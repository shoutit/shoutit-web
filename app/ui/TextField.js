import React, { Component } from 'react';
import { trimWhitespaces } from '../utils/StringUtils';

if (process.env.BROWSER) {
  require('./TextField.scss');
}

export default class TextField extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || props.value || '',
    };
  }
  state = {
    value: '',
    focus: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  getValue() {
    return this.refs.input.value;
  }

  handleChange(e) {
    const value = trimWhitespaces(this.refs.input.value);
    if (this.props.onChange) {
      this.props.onChange(value, e);
    }
    this.setState({ value });
  }

  handleFocus(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
    this.setState({ focus: true });
  }

  handleBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
    this.setState({ focus: false });
  }

  render() {
    const { block = false, disabled, label, className, ...props } = this.props;
    const { value, focus } = this.state;

    let cssClass = 'TextField';
    if (block) {
      cssClass += ' block';
    }
    if (value) {
      cssClass += ' has-value';
    }
    if (focus) {
      cssClass += ' has-focus';
    }
    if (disabled) {
      cssClass += ' disabled';
    }
    if (block) {
      cssClass += ' block';
    }
    if (className) {
      cssClass += ` ${className}`;
    }
    return (
      <span className={ cssClass }>
        { label &&
          <span className="TextField-label">{ label }</span>
        }
        <input
          ref="input"
          {...props}
          disabled={ disabled }
          className="TextField-input"
          onChange={ e => this.handleChange(e) }
          onFocus={ e => this.handleFocus(e) }
          onBlur={ e => this.handleBlur(e) }
        />
      </span>
    );
  }
}
