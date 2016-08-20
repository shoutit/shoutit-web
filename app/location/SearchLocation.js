import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import trim from 'lodash/trim';
import throttle from 'lodash/throttle';
import { geocodePlace, formatLocation } from '../utils/LocationUtils';
import { loadPlacePredictions, geocode } from '../actions/location';
import { getCurrentLanguage } from '../reducers/i18n';
import { getCurrentLocation } from '../reducers/currentLocation';

import TextField from '../forms/TextField';
import Progress from '../widgets/Progress';

export class SearchLocation extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    predictions: PropTypes.object,
    error: PropTypes.object,
    location: PropTypes.object,
    isFetching: PropTypes.bool,
    lastInput: PropTypes.string,
    language: PropTypes.string.isRequired,
    onLocationSelect: PropTypes.func,
  };

  static defaultProps = {
    predictions: [],
    isFetching: false,
    lastInput: '',
  };

  constructor(props) {
    super(props);
    this.handleChange = throttle(this.handleChange, 1000).bind(this);
    this.handlePredictionClick = this.handlePredictionClick;
  }

  state = {
    input: '',
    isGeocoding: false,
  };

  componentDidMount() {
    this.input.select();
  }

  handleChange() {
    const input = trim(this.input.getValue()).toLowerCase();
    this.setState({ input });
    if (input.length < 2) {
      return;
    }
    if (this.props.predictions[input]) {
      return;
    }
    this.props.dispatch(loadPlacePredictions(input));
  }

  handlePredictionClick(e, prediction) {
    e.preventDefault();
    this.setState({ isGeocoding: true });
    geocodePlace(prediction.placeId, this.props.language)
      .then(location => this.props.dispatch(geocode(location)))
      .then(location => {
        if (location && this.props.onLocationSelect) {
          this.props.onLocationSelect(location, prediction);
        }
      });
  }

  render() {
    const { isFetching, predictions, lastInput } = this.props;
    const { input, isGeocoding } = this.state;
    const lastPredictions = predictions[input] || predictions[lastInput] || [];

    return (
      <div>

        <FormattedMessage
          id="searchLocation.input.placeholder"
          defaultMessage="Search for a location">
          { message =>
            <TextField
              name="SearchLocation-location"
              type="text"
              value={ this.props.location ? formatLocation(this.props.location) : '' }
              ref={ el => { this.input = el; } }
              disabled={ isGeocoding }
              placeholder={ message }
              onChange={ this.handleChange }
            />
          }
        </FormattedMessage>

        { (isFetching || isGeocoding) && <Progress animate /> }

        { !isGeocoding && input && lastPredictions.length > 0 &&
          <ul className="htmlSelectableList">
            { lastPredictions.map(prediction =>
              <li key={ prediction.id }>
                <a onClick={ e => this.handlePredictionClick(e, prediction) }>
                  { prediction.description }
                </a>
              </li>
            ) }
          </ul>
        }

      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.placePredictions,
  language: getCurrentLanguage(state),
  location: getCurrentLocation(state),
});

export default connect(mapStateToProps)(SearchLocation);
