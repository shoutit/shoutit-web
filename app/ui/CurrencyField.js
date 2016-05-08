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
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      value: (!props.value || isNaN(props.value)) ? '' : props.value / 100,
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
    value = value.replace(/,/g, '.');
    const { onChange } = this.props;
    if ((!value || isNaN(value)) && onChange) {
      onChange(null, e);
    } else if (onChange) {
      onChange(round(value * 100, 2), e);
    }
    this.setState({ value }, () => {
      this.field.setValue(value);
    });
  }
  handleBlur(value) {
    if (!value || isNaN(value)) {
      this.setState({ value: '' });
    } else {
      this.setState({ value: round(value, 2) });
    }
  }
  render() {
    const { value } = this.state;
    return (
      <TextField
        inputRef={ field => { this.field = field; } }
        { ...this.props }
        value={ value }
        onBlur={ this.handleBlur }
        onChange={ this.handleChange }
      />
    );
  }
}

CurrencyField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};
