import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./Picker.scss');
}

export default class Picker extends Component {

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
    return this.state.value;
  }

  handleChange(e) {
    const value = this.refs.select.value;
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
    const { block = false, label, disabled, children, className, ...props } = this.props;
    const { value, focus } = this.state;

    let cssClass = 'Picker';
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
    if (className) {
      cssClass += ` ${className}`;
    }
    return (
      <span className={ cssClass }>
        <select
          ref="select"
          {...props}
          disabled={ disabled }
          className="Picker-select"
          onChange={ e => this.handleChange(e) }
          onFocus={ e => this.handleFocus(e) }
          onBlur={ e => this.handleBlur(e) }
        >
          {children}
        </select>
        { label &&
          <span className="Picker-label">{ label }</span>
        }
      </span>
    );
  }
}
