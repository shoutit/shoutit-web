import React, { PropTypes, Component } from 'react';
import round from 'lodash/round';

import TextField from './TextField';
import CurrencySelect from '../forms/CurrencySelect';

import './PriceField.scss';

export default class PriceField extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currencyValue: PropTypes.string,
    onChange: PropTypes.func,
    onCurrencyChange: PropTypes.func,
    showCurrencies: PropTypes.bool,
  }
  static defaultProps = {
    currency: '',
  }
  constructor(props) {
    super(props);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      currencyValue: props.currencyValue,
      value: (!props.value || isNaN(props.value)) ? '' : props.value / 100,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value / 100,
      }, () => {
        this.field.setValue(this.state.value || '');
      });
    }
    if (nextProps.currencyValue !== this.props.currencyValue) {
      this.setState({
        currencyValue: nextProps.currencyValue,
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
    this.field.focus();
  }
  blur() {
    this.field.blur();
  }
  select() {
    this.field.select();
  }
  handleChange(value, e) {
    value = value.replace(/,/g, '.');
    if ((!value || isNaN(value)) && this.props.onChange) {
      this.props.onChange(null, e);
    } else if (this.props.onChange) {
      this.props.onChange(round(value * 100, 2), e);
    }
    this.setState({ value }, () => this.field.setValue(value));
  }
  handleCurrencyChange(e) {
    const currencyValue = e.target.value;
    this.setState({ currencyValue });
    this.select();
    if (this.props.onCurrencyChange) {
      this.props.onCurrencyChange(currencyValue || null, e);
    }
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
    let startElement;
    if (this.props.showCurrencies) {
      startElement = (
        <CurrencySelect
          name="currency"
          value={ this.state.currencyValue }
          onChange={ this.handleCurrencyChange }
        />
      );
    }
    return (
      <TextField
        className="PriceField"
        inputRef={ field => { this.field = field; } }
        { ...this.props }
        startElement={ startElement }
        flexibleContent
        value={ value }
        onBlur={ this.handleBlur }
        onChange={ this.handleChange }
      />
    );
  }
}
