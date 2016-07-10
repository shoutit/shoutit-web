import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import throttle from 'lodash/throttle';
import debug from 'debug';

import { getCurrentLocale } from '../reducers/i18n';
import { getCurrentLocation } from '../reducers/currentLocation';

import CountryFlag from '../location/CountryFlag';

import { ESCAPE, ENTER } from '../utils/keycodes';
import { geocodePlace, formatLocation } from '../utils/LocationUtils';
import { loadPlacePredictions, resetPlacePredictionsLastInput, updateCurrentLocation } from '../actions/location';

import Overlay from '../widgets/Overlay';
import FormField from './FormField';

const log = debug('shoutit:ui:LocationField');

export class LocationField extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    error: PropTypes.object,
    inputRef: PropTypes.func,
    disabled: PropTypes.bool,
    isFetching: PropTypes.bool,
    lastInput: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    predictions: PropTypes.array,
    updatesUserLocation: PropTypes.bool,
  };
  static defaultProps = {
    updatesUserLocation: true,
  };
  constructor(props) {
    super(props);
    this.fetchPredictions = throttle(this.fetchPredictions, 1000).bind(this);
    this.select = this.select.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePredictionClick = this.handlePredictionClick.bind(this);

    this.state = {
      readOnly: false,
      isGeocoding: false,
      showOverlay: false,
      error: props.error,
      previousPredictions: null,
    };

    if (props.location) {
      this.state.value = formatLocation(props.location, {
        showCountry: false,
        locale: props.locale,
      });
      this.state.location = props.location;
    }
  }
  componentWillReceiveProps(nextProps) {
    let state;
    if (nextProps.predictions) {
      state = {
        ...state,
        previousPredictions: nextProps.predictions,
      };
    }
    if (nextProps.location.slug !== this.props.location.slug) {
      const value = formatLocation(nextProps.location, {
        showCountry: false,
        locale: this.props.locale,
      });
      state = {
        ...state,
        value,
      };
      this.field.setValue(value);
    }
    if (state) {
      this.setState(state);
    }
  }
  componentWillUnmount() {
    const { lastInput, dispatch } = this.props;
    clearTimeout(this.timeoutId);
    if (lastInput) {
      dispatch(resetPlacePredictionsLastInput());
    }
  }
  getValue() {
    return this.state.location;
  }
  timeoutId = null;
  focus() {
    this.field.focus();
  }
  blur() {
    this.field.blur();
  }
  select() {
    this.field.select();
  }
  handleFocus() {
    this.select();
    this.setState({
      readOnly: true,
      hasFocus: true,
      showOverlay: true,
    });
  }
  handleBlur() {
    let timeout = 0;
    if (this.state.previousPredictions || this.props.predictions) {
      timeout = 300;
    }
    this.timeoutId = setTimeout(() => {
      let state = {
        showOverlay: false,
      };

      if (!this.field.getValue()) {
        state = {
          ...state,
          previousPredictions: null,
        };
      }
      this.setState(state);
      const { dispatch, lastInput } = this.props;
      if (lastInput) {
        dispatch(resetPlacePredictionsLastInput());
      }
    }, timeout);
  }
  handleChange(value) {
    let state = {
      value, errors: [], showOverlay: true,
    };
    if (!value) {
      state = {
        ...state,
        previousPredictions: null,
      };
    }
    this.setState(state, () => {
      if (value.length > 1) {
        this.fetchPredictions(value);
      }
    });
  }
  handleKeyDown(e) {
    if (e.keyCode === ESCAPE) {
      this.setState({ showOverlay: false });
    } else if (e.keyCode === ENTER) {
      e.preventDefault();
      e.stopPropagation();
      if (this.props.predictions) {
        this.handlePredictionClick(this.props.predictions[0]);
      }
    }
  }
  handlePredictionClick(prediction) {
    this.setState({
      isGeocoding: true,
      value: prediction.description,
      readOnly: false,
      showOverlay: false,
      error: null,
    });
    this.blur();
    log('Start geocoding place with id %s', prediction.placeId);
    geocodePlace(prediction.placeId, this.props.locale, (err, location) => {
      this.setState({ isGeocoding: false }, () => {
        if (location && location.city) {
          log('Found location geocoding %s', prediction.placeId, location);
          const value = formatLocation(location, {
            showCountry: false,
            locale: this.props.locale,
          });
          this.setState({ value, location }, () => {
            this.handleGeocodeSuccess(location);
          });
          this.field.setValue(value);
          return;
        }
        log('Could not geocode %s, showing error', prediction.placeId);
        // Prediction couldn't be geocoded
        this.setState({
          error: {
            errors: [{
              location: this.props.name,
              message: 'This place is not valid: please choose another one.',
            }],
          },
          value: prediction.description,
          showOverlay: true,
          readOnly: true,
        }, this.select);
      });
    });
  }
  handleGeocodeSuccess(location) {
    const { disabled, onChange, dispatch, updatesUserLocation } = this.props;
    if (disabled) {
      return;
    }
    if (updatesUserLocation) {
      dispatch(updateCurrentLocation(location));
    }
    if (onChange) {
      onChange(location);
    }
  }
  fetchPredictions(value) {
    const { dispatch } = this.props;
    const input = value.toLowerCase();
    dispatch(loadPlacePredictions(input));
  }
  renderPredictionResults() {
    const { predictions, lastInput } = this.props;
    const { previousPredictions } = this.state;
    const results = predictions || previousPredictions || [];
    if (results.length === 0 || !lastInput || !this.state.value) {
      return (
        <p style={ { margin: '.5rem 0.5rem', fontSize: '0.75rem' } }>
          <FormattedMessage
            defaultMessage="Start typing to search."
            id="locationField.instructions"
          />
        </p>
      );
    }
    return (
      <ul className="htmlSelectableList">
        { results.map(prediction =>
          <li key={ prediction.id }>
            <a href="#" onClick={ e => { e.preventDefault(); this.handlePredictionClick(prediction); } }>
              { prediction.description }
            </a>
          </li>
        ) }
      </ul>
    );
  }
  render() {
    const { inputRef, name, location, ...props } = this.props; // eslint-disable-line
    const { readOnly, value, showOverlay, hasFocus, error } = this.state;

    let countryFlag;
    if (location) {
      countryFlag = <CountryFlag code={ location.country } size="small" />;
    }
    return (
      <div className="FormField" style={ { position: 'relative' } }>
        <span onClick={ this.select }>
          <FormField
            { ...props }
            name={ name }
            error={ error }
            autoComplete="off"
            readOnly={ !readOnly }
            type="text"
            value={ value }
            onFocus={ this.handleFocus }
            onBlur={ this.handleBlur }
            onChange={ this.handleChange }
            onKeyDown={ this.handleKeyDown }
            startElement={ countryFlag }
            ref={ el => {
              this.field = el;
              if (inputRef) {
                inputRef(this);
              }
            } }
            field="input" />
        </span>
        <Overlay
          rootClose
          onHide={ () => {
            if (!hasFocus) {
              this.setState({ showOverlay: false });
            }
          } }
          style={ { width: '100%' } }
          show={ showOverlay }
          placement="bottom"
          container={ this }
          target={ () => ReactDOM.findDOMNode(this.field) }>
            { this.renderPredictionResults() }
        </Overlay>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  locale: getCurrentLocale(state),
  isFetching: state.placePredictions.isFetching,
  predictions: state.placePredictions.predictions[state.placePredictions.lastInput],
  lastInput: state.placePredictions.lastInput,
  location: ownProps.location || getCurrentLocation(state),
});

export default connect(mapStateToProps)(LocationField);
