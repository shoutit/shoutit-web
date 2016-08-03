import range from 'lodash/range';
import sortBy from 'lodash/sortBy';
import padStart from 'lodash/padStart';
import React, { PropTypes, Component } from 'react';
import { injectIntl } from 'react-intl';

import Label from '../forms/Label';
import FieldsGroup from '../forms/FieldsGroup';
import ValuePicker from '../forms/ValuePicker';

import { getLocalizedMonths, getDateOrderWeight } from '../utils/IntlUtils';

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
    const { className, label, value, intl } = this.props; //eslint-disable-line
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
            flex
            key="year"
            name="year"
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
            flex
            key="month"
            name="month"
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
            flex
            key="day"
            name="day"
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
      <div className="FormField">
        { label && <Label>{ label }</Label> }
        <FieldsGroup className={ className }>
          { components }
        </FieldsGroup>
      </div>
    );
  }
}

export default injectIntl(DatePicker);
