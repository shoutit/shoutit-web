import React, { PropTypes, Component } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import last from 'lodash/last';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';
import { getCountryName } from '../utils/LocationUtils';
import RangeField from '../ui/RangeField';
import Icon from '../ui/Icon';

const STEPS = [0, 4, 8, 12, 16, 20, 24, 32, 36, 40, 44, 48, 52, 56, 60, 64, 82, 100];
const VALUES = ['city', 1, 2, 3, 5, 7, 10, 15, 20, 30, 60, 100, 200, 300, 400, 500, 'state', 'country'];

import './LocationRange.scss';

export class LocationRange extends Component {
  static propTypes = {
    location: PropTypes.shape({
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    locale: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    name: 'location_range',
  }
  constructor(props) {
    super(props);
    this.setFirstValue = this.setFirstValue.bind(this);
    this.setLastValue = this.setLastValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = this.getStateFromProps(props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      return;
    }
    this.setState(this.getStateFromProps(nextProps), () => {
      const index = VALUES.indexOf(this.getValue());
      const currentStep = STEPS[index];
      const range = this.refs.rangeField.getValue();
      if (range >= currentStep || range <= STEPS[index - 1]) {
        this.refs.rangeField.setValue(currentStep);
      }
    });
  }
  getStateFromProps(props) {
    return {
      index: props.value ? VALUES.indexOf(props.value) : 0,
    };
  }
  getLabel() {
    const value = this.getValue();
    if (value === 'city') {
      return (
        <FormattedMessage
          id="ui.locationRange.city"
          defaultMessage="Within {city}"
          values={ { city: this.props.location.city } }
        />
      );
    } else if (value === 'country') {
      return (
        <FormattedMessage
          id="ui.locationRange.country"
          defaultMessage="Entire {country}"
          values={ {
            country: getCountryName(this.props.location.country, this.props.locale),
          } }
        />
      );
    } else if (value === 'state') {
      return (
        <FormattedMessage
          id="ui.locationRange.state"
          defaultMessage="Entire {state}"
          values={ { state: this.props.location.state } }
        />
      );
    }
    return (
      <FormattedMessage
        id="ui.locationRange.distance"
        defaultMessage="Within {distance}km"
        values={ { distance: <FormattedNumber value={ value } /> } }
      />
    );
  }
  getValue() {
    const value = VALUES[this.state.index];
    return typeof value === 'string' ? value : parseInt(value, 10);
  }
  setFirstValue() {
    this.setState({ index: 0 }, () =>
      this.refs.rangeField.setValue(STEPS[this.state.index])
    );
  }
  setLastValue() {
    this.setState({ index: STEPS.length - 1 }, () =>
      this.refs.rangeField.setValue(STEPS[this.state.index])
    );
  }
  handleChange(value) {
    let index = 0;
    if (value > STEPS[0]) {
      for (let i = 0; i < STEPS.length; i++) {
        const step = STEPS[i];
        if (value <= step) {
          index = i;
          break;
        }
      }
    }
    this.setState({ index }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.getValue());
      }
    });

  }
  render() {
    return (
      <div className="LocationRange">
        <RangeField
          ref="rangeField"
          id={ this.props.name }
          type="range"
          onChange={ this.handleChange }
          min={ STEPS[0] }
          max={ last(STEPS) }
          value={ STEPS[this.state.index] }
        />
        <label htmlFor={ this.props.name }>
          <span className="LocationRange-icon">
            <Icon
              name="current-location"
              size="small"
              onClick={ this.setFirstValue }
            />
          </span>
          <span className="LocationRange-label">
            { this.getLabel() }
          </span>
          <span className="LocationRange-icon">
            <Icon
              name="globe"
              size="small"
              onClick={ this.setLastValue }
            />
          </span>
        </label>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(LocationRange);
