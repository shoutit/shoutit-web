import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { getCurrencies } from '../reducers/currencies';

const MESSAGES = defineMessages({
  firstOptionLabel: {
    id: 'ui.CurrencySelect.emptyOptionLabel',
    defaultMessage: 'Currency',
  },
});

class CurrencySelect extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    currencies: PropTypes.array.isRequired,
  }
  render() {
    const props = { ...this.props };
    delete props.intl;
    delete props.currencies;
    delete props.dispatch;
    return (
      <select { ...props }>
        <option value="">
          { this.props.intl.formatMessage(MESSAGES.firstOptionLabel) }
        </option>
        { this.props.currencies.map(currency =>
          <option key={ currency.code } value={ currency.code }>
            { currency.code } { currency.name }
          </option>
        ) }
      </select>
    );
  }
}

const mapStateToProps = state => ({
  currencies: getCurrencies(state),
});

export default connect(mapStateToProps)(injectIntl(CurrencySelect));
