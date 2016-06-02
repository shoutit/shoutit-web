import React, { PropTypes, Component } from 'react';
import last from 'lodash/last';
import { getCountryName } from '../utils/LocationUtils';
import RangeField from '../ui/RangeField';

const STEPS = [0, 4, 8, 12, 16, 20, 24, 32, 36, 40, 44, 48, 52, 56, 60, 64, 82, 100];
const VALUES = ['city', 1, 2, 3, 5, 7, 10, 15, 20, 30, 60, 100, 200, 300, 400, 500, 'state', 'country'];

if (process.env.BROWSER) {
  require('./LocationRange.scss');
}

export default class LocationRange extends Component {
  static propTypes = {
    location: PropTypes.shape({
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string,
    initialValue: PropTypes.oneOf(VALUES),
  };
  static defaultProps = {
    name: 'location_range',
  }
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      index: props.initialValue ? VALUES.indexOf(props.initialValue) : 0,
    };
  }
  getLabel() {
    const value = this.getValue();
    if (value === 'city') {
      return `Within ${this.props.location.city}`;
    } else if (value === 'country') {
      return `Entire ${getCountryName(this.props.location.country)}`;
    } else if (value === 'state') {
      return `Entire ${this.props.location.state}`;
    }
    return `Within ${value} km`;
  }
  getValue() {
    const value = VALUES[this.state.index];
    return typeof value === 'string' ? value : parseInt(value, 10);
  }
  handleChange(e) {
    const value = e.target.value;
    let index = 0;
    if (value > STEPS[0]) {
      for (let i = 0; i < STEPS.length; i++) {
        const step = STEPS[i];
        if (value < step) {
          index = i;
          break;
        }
      }
    }
    this.setState({ index });
  }
  render() {
    return (
      <div className="LocationRange">
        <RangeField
          id={ this.props.name }
          type="range"
          onChange={ this.handleChange }
          min={ STEPS[0] }
          max={ last(STEPS) }
          value={ STEPS[this.state.index] }
        />
        <label htmlFor={ this.props.name }>
          { this.getLabel() }
        </label>
      </div>
    );
  }
}
