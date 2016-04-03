import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/function/throttle';
import { trimWhitespaces } from '../utils/StringUtils';
import { geocodePlace } from '../utils/LocationUtils';
import { loadPlacePredictions } from '../actions/location';

import Progress from '../ui/Progress';

export class SearchLocation extends Component {

  static propTypes = {
    predictions: PropTypes.object,
    error: PropTypes.object,
    isFetching: PropTypes.bool,
    lastInput: PropTypes.string,
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

  handleChange() {
    const input = trimWhitespaces(this.refs.input.value).toLowerCase();
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
    const { onLocationSelect } = this.props;
    this.setState({ isGeocoding: true });
    geocodePlace(prediction.placeId, (err, location) => {
      if (location && onLocationSelect) {
        onLocationSelect(location, prediction);
      }
      // this.setState({ isGeocoding: false });
    });
  }

  render() {
    const { isFetching, predictions, lastInput } = this.props;
    const { input, isGeocoding } = this.state;
    const lastPredictions = predictions[input] || predictions[lastInput] || [];

    return (
      <div>
        <input
          className="htmlInput block"
          type="text"
          ref="input"
          disabled={ isGeocoding }
          placeholder="Search for a location"
          onChange={ this.handleChange }
        />

        { (isFetching || isGeocoding) &&
          <Progress animate label={ isGeocoding ? 'Setting location…' : 'Searching for locations…' } />
        }

        { !isGeocoding && input && lastPredictions.length > 0 &&
          <ul className="htmlSelectableList">
            { lastPredictions.map(prediction =>
              <li key={ prediction.id }>
                <a href="#" onClick={ e => this.handlePredictionClick(e, prediction) }>
                  { prediction.description }
                </a>
              </li>
            )}
          </ul>
        }

      </div>
    );
  }
}

const mapStateToProps = state => state.placePredictions;

export default connect(mapStateToProps)(SearchLocation);
