import React, { PropTypes, Component } from 'react';
import round from 'lodash/round';
import { injectIntl } from 'react-intl';

import TextField from './TextField';
import CurrencySelect from '../forms/CurrencySelect';
import { numberFromString } from '../utils/IntlUtils';

import './PriceField.scss';

export class PriceField extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
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
    this.state = this.getStateFromProps(props);

  }
  getStateFromProps(props) {
    const value = (!props.hasOwnProperty('value') || props.value === '' || isNaN(props.value)) ? '' : props.value / 100;
    return {
      currencyValue: props.currencyValue,
      value: value === '' ? '' : this.formatNumericValue(value),
    };
  }
  formatNumericValue(value) {
    return this.props.intl.formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  formatStringValue(value) {
    if (value === '') {
      return '';
    }
    const valueAsNumber = numberFromString(value.toString(), this.props.intl);
    if (isNaN(valueAsNumber)) {
      return '';
    }
    return this.formatNumericValue(valueAsNumber);
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
  handleChange(value) {
    if (this.props.onChange) {
      const valueAsNumber = numberFromString(value, this.props.intl);
      this.props.onChange(round(valueAsNumber * 100, 2));
    }
    this.setState({ value });
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
    this.setState({ value: this.formatStringValue(value) });
  }
  render() {
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
    const props = { ...this.props };
    delete props.currency;
    delete props.showCurrencies;
    delete props.onCurrencyChange;
    delete props.currencyValue;
    return (
      <TextField
        { ...props }
        ref="field"
        value={ this.state.value }
        className="PriceField"
        startElement={ startElement }
        flexibleContent
        onBlur={ this.handleBlur }
        onChange={ this.handleChange }
      />
    );
  }
}

export default injectIntl(PriceField);
