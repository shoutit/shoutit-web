import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import throttle from 'lodash/function/throttle';

import { ESCAPE, ENTER } from '../utils/keycodes';
import { geocodePlace, formatLocation } from '../utils/LocationUtils';
import { loadPlacePredictions, resetPlacePredictionsLastInput } from '../actions/location';

import Overlay from '../ui/Overlay';

import FormField from './FormField';

export class LocationField extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    predictions: PropTypes.object,
    errors: PropTypes.object,
    isFetching: PropTypes.bool,
    lastInput: PropTypes.string,
    onChange: PropTypes.func,
    inputRef: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.fetchPredictions = throttle(this.fetchPredictions, 1000).bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePredictionClick = this.handlePredictionClick.bind(this);

    this.state = {
      readOnly: false,
      isGeocoding: false,
      showOverlay: false,
      errors: props.errors,
      previousPredictions: null,
    };

    if (props.initialValue) {
      const { city, country } = props.initialValue;
      this.state.value = formatLocation({ city, country });
      this.state.location = props.initialValue;
    }

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.predictions) {
      this.setState({ previousPredictions: nextProps.predictions });
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeoutId);
    this.props.dispatch(resetPlacePredictionsLastInput());
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
    this.setState({ readOnly: true, hasFocus: true, showOverlay: true });
  }
  handleBlur() {
    this.timeoutId = setTimeout(() => {
      this.setState({ showOverlay: false });
      this.props.dispatch(resetPlacePredictionsLastInput());
      if (!this.field.getValue()) {
        this.setState({ previousPredictions: null });
      }
    }, 100);
  }
  handleChange() {
    const value = this.field.getValue();
    if (value.length > 1) {
      this.fetchPredictions(value);
    }
    this.setState({ showOverlay: true, value, errors: [] });
  }
  handleKeyUp(e) {
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
      errors: [],
    });
    const previousInput = this.props.lastInput;
    this.blur();
    geocodePlace(prediction.placeId, (err, location) => {
      this.setState({ isGeocoding: false }, () => {
        const { lastInput, onChange } = this.props;
        if (lastInput !== previousInput) {
          // ignore reponses arriving too late
          return;
        }
        if (location && location.city) {
          const value = formatLocation(location);
          this.setState({ location, value });
          if (onChange) {
            onChange(location);
          }
          return;
        }
        // Prediction couldn't be geocoded
        this.setState({
          location: null,
          errors: [{
            message: 'This place is not valid: please choose another one.',
          }],
          value: prediction.description,
          showOverlay: true,
          readOnly: true,
        }, this.select);
      });
    });
  }
  fetchPredictions(value) {
    const { dispatch } = this.props;
    const input = value.toLowerCase();
    dispatch(loadPlacePredictions(input));
  }
  renderPredictionResults() {
    const { predictions, lastInput } = this.props;
    const { previousPredictions } = this.state;
    if (!predictions && !previousPredictions && !lastInput) {
      return <p style={{ margin: '.5rem 0.5rem', fontSize: '0.75rem' }}>Start typing to search for a location.</p>;
    }
    const results = predictions || previousPredictions || [];
    return (
      <ul className="htmlSelectableList">
        { results.map(prediction =>
          <li key={ prediction.id }>
            <a href="#" onClick={ e => { e.preventDefault(); this.handlePredictionClick(prediction); }}>
              { prediction.description }
            </a>
          </li>
        )}
      </ul>
    );
  }
  render() {
    const { inputRef } = this.props;
    const { readOnly, value, showOverlay, hasFocus, errors } = this.state;
    return (
      <div className="LocationField" style={{ position: 'relative' }}>
        <FormField
          { ...this.props }
          errors={ errors }
          autoComplete="off"
          readOnly={ !readOnly }
          type="text"
          initialValue=""
          value={ value }
          onFocus={ this.handleFocus }
          onBlur={ this.handleBlur }
          onChange={ this.handleChange }
          onKeyUp={ this.handleKeyUp }
          ref={ el => {
            this.field = el;
            if (inputRef) {
              inputRef(this);
            }
          }}
          field={ <input ref="input" /> } />
        <Overlay
          rootClose
          onHide={ () => {
            if (!hasFocus) {
              this.setState({ showOverlay: false });
            }
          }}
          style={{ width: '100%' }}
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

LocationField.propTypes = {
  initialValue: PropTypes.object,
};


const mapStateToProps = state => ({
  isFetching: state.placePredictions.isFetching,
  predictions: state.placePredictions.predictions[state.placePredictions.lastInput],
  lastInput: state.placePredictions.lastInput,
});

export default connect(mapStateToProps)(LocationField);
