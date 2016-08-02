import range from 'lodash/range';
import sortBy from 'lodash/sortBy';
import padStart from 'lodash/padStart';
import React, { PropTypes, Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';

import FormField from './FormField';
import ValuePicker from '../forms/ValuePicker';

import { getLocalizedMonths, getDateOrderWeight } from '../utils/IntlUtils';

const MESSAGES = defineMessages({
  year: {
    id: 'forms.datePicker.year',
    defaultMessage: 'Year',
  },
  month: {
    id: 'forms.datePicker.month',
    defaultMessage: 'Month',
  },
  day: {
    id: 'forms.datePicker.day',
    defaultMessage: 'Day',
  },
});

const padZeroes = val => padStart(val, 2, 0);

const getYears = () => {
  const endYear = new Date().getFullYear() + 1;
  return range(endYear - 100, endYear).reverse();
};

const getDays = () => range(1, 32).map(padZeroes);

class DatePicker extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,

    intl: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.yearRef;
    this.monthRef;
    this.dayRef;
  }

  buildYearOptions() {
    return getYears().map(year => ({
      label: year,
      value: year,
    }));
  }

  buildMonthOptions() {
    return getLocalizedMonths(this.props.intl).map((month, index) => ({
      label: month,
      value: padZeroes(index + 1),
    }));
  }

  buildDayOptions() {
    return getDays().map(day => ({
      label: day,
      value: day,
    }));
  }

  handleChange() {
    const { onChange } = this.props;
    const year = this.yearRef.getValue();
    const month = this.monthRef.getValue();
    const day = this.dayRef.getValue();

    if (!year || !month || !day) {
      onChange(null);
      return;
    }

    onChange(`${year}-${month}-${day}`);
  }

  render() {
    const { className, label, value, intl, intl: { formatMessage } } = this.props;
    const orderWeight = getDateOrderWeight(intl);

    let date;
    let year;
    let month;
    let day;

    if (value) {
      date = new Date(value);
      year = date.getFullYear();
      month = padZeroes(date.getMonth() + 1);
      day = padZeroes(date.getDate());
    }

    const components = sortBy([
      {
        order: orderWeight.year,
        component: (
          <ValuePicker
            key="year"
            name="year"
            label={ formatMessage(MESSAGES.year) }
            className="DatePicker"
            inputRef={ ref => (this.yearRef = ref) }
            value={ `${year}` }
            defaultValue=""
            values={ this.buildYearOptions() }
            onChange={ this.handleChange }
          />
        ),
      },
      {
        order: orderWeight.month,
        component: (
          <ValuePicker
            key="month"
            name="month"
            label={ formatMessage(MESSAGES.month) }
            className="DatePicker"
            inputRef={ ref => (this.monthRef = ref) }
            value={ `${month}` }
            defaultValue=""
            values={ this.buildMonthOptions() }
            onChange={ this.handleChange }
          />
        ),
      },
      {
        order: orderWeight.day,
        component: (
          <ValuePicker
            key="day"
            name="day"
            label={ formatMessage(MESSAGES.day) }
            className="DatePicker"
            inputRef={ ref => (this.dayRef = ref) }
            value={ `${day}` }
            defaultValue=""
            values={ this.buildDayOptions() }
            onChange={ this.handleChange }
          />
        ),
      },
    ], 'order').map(item => item.component);

    return (
      <FormField
        name="datepicker"
        label={ label }
        className={ className }
      >
        { components }
      </FormField>
    );
  }
}

export default injectIntl(DatePicker);
