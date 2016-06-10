import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import trim from 'lodash/trim';
import throttle from 'lodash/throttle';
import { geocodePlace } from '../utils/LocationUtils';
import { loadPlacePredictions } from '../actions/location';
import { getCurrentLocale } from '../reducers/i18n';

import Progress from '../ui/Progress';

export class SearchLocation extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    predictions: PropTypes.object,
    error: PropTypes.object,
    isFetching: PropTypes.bool,
    lastInput: PropTypes.string,
    locale: PropTypes.string.isRequired,
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
    this.input.focus();
  }

  handleChange() {
    const input = trim(this.input.value).toLowerCase();
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
    geocodePlace(prediction.placeId, this.props.locale, (err, location) => {
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
            <input
              className="htmlInput block"
              type="text"
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
                <a href="#" onClick={ e => this.handlePredictionClick(e, prediction) }>
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
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(SearchLocation);
