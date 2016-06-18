import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./RangeField.scss');
}

export default class RangeField extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
  }
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }
  setValue(value) {
    this.setState({ value });
  }
  getValue() {
    return this.state.value;
  }
  handleChange(e) {
    this.setState({ value: e.target.value }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.value);
      }
    });
  }
  render() {
    return (
      <input
        {...this.props}
        value={ this.state.value }
        onChange={ this.handleChange.bind(this) }
        className="RangeField"
        type="range" />
    );
  }
}
