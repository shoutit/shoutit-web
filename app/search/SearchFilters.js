import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/lang/isEqual';

import TextField from '../ui/TextField';
import Picker from '../ui/Picker';
import LocationField from '../ui/LocationField';
import Button from '../ui/Button';
import SegmentedControl from '../ui/SegmentedControl';

import { setUserLocation } from '../actions/users';
import { setCurrentLocation } from '../actions/location';

if (process.env.BROWSER) {
  require('../styles/Form.scss');
  require('./SearchFilters.scss');
}

export class SearchFilters extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    searchParams: PropTypes.object,
  }

  static defaultProps = {
    disabled: false,
    searchParams: {
      category: '',
      filters: {},
    },
  }

  constructor(props) {
    super(props);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  getSearchParams() {
    const location = this.locationField.getValue();
    const searchParams = {
      city: location.city,
      state: location.state,
      country: location.country,
      search: this.refs.search.getValue() || undefined,
      shout_type: this.refs.shout_type.getValue(),
      category: this.refs.category.getValue(),
      filters: this.state.filters,
      min_price: parseInt(this.refs.min_price.getValue(), 10) || undefined,
      max_price: parseInt(this.refs.max_price.getValue(), 10) || undefined,
    };
    return searchParams;
  }

  getStateFromProps(props) {
    return {
      category: props.searchParams.category || 'all',
      shout_type: props.searchParams.shout_type || 'all',
      min_price: props.searchParams.min_price || '',
      max_price: props.searchParams.max_price || '',
      search: props.searchParams.search || '',
      filters: props.searchParams.filters || {},
    };
  }

  locationField = null;

  handleLocationChange(location) {
    const { dispatch, isLoggedIn } = this.props;
    dispatch(setCurrentLocation(location));
    if (isLoggedIn) {
      dispatch(setUserLocation(location));
    }
  }

  render() {
    const { categories, disabled, searchParams } = this.props;
    const { category, shout_type, min_price, max_price, search } = this.state;
    let filters = [];
    const selectedCategory = categories.find(({ slug }) => slug === category);
    if (selectedCategory && selectedCategory.filters) {
      filters = selectedCategory.filters.filter(filter => filter.values.length > 0);
    }

    return (
      <div className="SearchFilters">
        <form
          className="Form"
          onSubmit={ e => {
            if (disabled) {
              return;
            }
            e.preventDefault();
            this.props.onSubmit(this.getSearchParams());
          }}
        >
          <SegmentedControl disabled={ disabled } ref="shout_type" name="shout_type" options={ [
            { label: 'Offers', value: 'offer', checked: true },
            { label: 'Requests', value: 'request' },
          ]} onChange={ shout_type => this.setState({ shout_type }) } />

          <LocationField
            block
            inputRef={ el => { this.locationField = el; }}
            label="Location"
            name="location"
            initialValue={ searchParams }
            onChange={ () => this.refs.submitButton.focus() }
          />
          <TextField
            label="Keywords"
            placeholder="Enter one or more keywords"
            block
            disabled={ disabled }
            name="search"
            ref="search"
            value={ search }
            onChange={ search => this.setState({ search }) }
          />

          <Picker
            className="SearchFilters-input"
            block
            label="Category"
            disabled={ disabled }
            ref="category"
            name="category"
            value={ category }
            onChange={ category => this.setState({ category, filters: {} }) }
          >
            <option value="all">All categories</option>
            { categories.map(({ slug, name }) =>
              <option value={ slug } key={ slug }>
                { name }
              </option>
            )}
          </Picker>

          { filters.length > 0 &&
            <div className="Form-inset-small">
              { filters.map(filter =>
                  <span key={ filter.name }>
                    <Picker
                      className="SearchFilters-input"
                      block
                      label={ filter.name }
                      name={ filter.slug }
                      disabled={ disabled }
                      value={ this.state.filters[filter.slug] || 'all' }
                      onChange={ value =>
                        this.setState({
                          filters: {
                            ...this.state.filters,
                            [filter.slug]: value,
                          } })
                        }
                    >
                      <option value="all">All</option>
                      { filter.values.map(value =>
                        <option value={ value.slug } key={ value.slug }>{ value.name}</option>
                      )}
                    </Picker>
                  </span>
                )
              }
            </div>
          }

        <TextField
          autoComplete="off"
          className="SearchFilters-input"
          placeholder="Min price"
          block
          label="Starting from price"
          disabled={ disabled }
          name="min_price"
          ref="min_price"
          value={ min_price }
          onChange={ min_price => this.setState({ min_price }) }
        />
        <TextField
          autoComplete="off"
          className="SearchFilters-input"
          placeholder="Max price"
          label="To price"
          block
          disabled={ disabled }
          name="max_price"
          ref="max_price"
          value={ max_price }
          onChange={ max_price => this.setState({ max_price }) }
        />

          <div className="SearchFilters-buttons">
            <Button ref="submitButton" block primary size="small" disabled={ disabled || isEqual(this.state, this.props.searchParams) } type="submit" label="Search" />
          </div>
        </form>
      </div>
    );
  }
}

SearchFilters.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
  disabled: PropTypes.bool,
};

const mapStateToProps = state => ({
  categories: state.categories.ids.map(id => state.entities.categories[id]),
  isLoggedIn: !!state.session.user,
});

export default connect(mapStateToProps)(SearchFilters);
