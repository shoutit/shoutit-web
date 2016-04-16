import React, { PropTypes, Component } from 'react';
import round from 'lodash/math/round';

import TextField from './TextField';

// const parseRE = /[^\d\.]/g;
//
// function cleanValue(value) {
//   return value.replace(parseRE, '');
// }

export default class CurrencyField extends Component {
  constructor(props) {
    super(props);
    // this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      value: isNaN(props.value) ? '' : props.value / 100,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value / 100,
      });
    }
  }
  getValue() {
    return this.state.value;
  }
  getValue() {
    const { value } = this.state;
    if (isNaN(value)) {
      return '';
    }
    return parseInt(round(this.state.value, 2) * 100, 10);
  }
  focus() {
    this.refs.field.focus();
  }
  blur() {
    this.refs.field.blur();
  }
  select() {
    this.refs.field.select();
  }
  handleChange(value, e) {
    const { onChange } = this.props;
    if (!value || isNaN(value)) {
      if (onChange) {
        onChange(null, e);
      }
      return;
    }
    if (onChange) {
      onChange(round(value * 100, 2), e);
    }
  }
  render() {
    const { value } = this.state;
    return (
      <TextField
        { ...this.props }
        value={ value }
        onChange={ this.handleChange }
      />
    );
  }
}

CurrencyField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};
