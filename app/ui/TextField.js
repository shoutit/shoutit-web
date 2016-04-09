import React, { Component } from 'react';
import { trimWhitespaces } from '../utils/StringUtils';
import Tooltip from '../ui/Tooltip';

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

  focus() {
    this.refs.input.focus();
  }

  select() {
    this.refs.input.select();
  }

  blur() {
    this.refs.input.blur();
  }

  render() {
    const { block = false, disabled, label, className, placeholder, errors, tooltipPlacement = 'right', ...props } = this.props;
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
    if (!label) {
      cssClass += ' no-label';
    }
    if (className) {
      cssClass += ` ${className}`;
    }
    if (errors && errors.length > 0) {
      cssClass += ' has-error';
    }
    return (
      <Tooltip
        destroyTooltipOnHide
        white
        visible={ errors && errors.length > 0 }
        placement={ tooltipPlacement }
        overlay={
          <div className="TextField-error-overlay">
            { errors && errors.map((error, i) => <div key={ i }>{ error.message }</div>) }
          </div>
        }>
        <span className={ cssClass }>
          { label &&
            <label className="TextField-label">{ label }</label>
          }
          { !label && placeholder &&
            <label className="TextField-label">{ placeholder }</label>
          }
          <input
            autoFocus={ errors && errors.length > 0 }
            ref="input"
            {...props}
            placeholder={ (!label && focus) ? null : placeholder }
            disabled={ disabled }
            className="TextField-input"
            onChange={ e => this.handleChange(e) }
            onFocus={ e => this.handleFocus(e) }
            onBlur={ e => this.handleBlur(e) }
          />
        </span>
      </Tooltip>
    );
  }
}
