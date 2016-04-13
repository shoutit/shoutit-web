import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/lang/isEqual';

import TextField from '../ui/TextField';
import Picker from '../ui/Picker';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

import SearchLocation from '../location/SearchLocation';

import { openModal, closeModal } from '../actions/ui';
import { setUserLocation } from '../actions/users';
import { setCurrentLocation } from '../actions/location';

if (process.env.BROWSER) {
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
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  getSearchParams() {
    const searchParams = {
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

  showLocationModal(e) {
    e.preventDefault();
    e.target.blur();
    const { dispatch, isLoggedIn } = this.props;
    const modal = (
      <Modal title="Change location" name="search-location">
        <SearchLocation
          onLocationSelect={ location => {
            dispatch(closeModal('search-location'));
            dispatch(setCurrentLocation(location));
            if (isLoggedIn) {
              dispatch(setUserLocation(location));
            }
          }}
        />
      </Modal>
    );
    this.props.dispatch(openModal(modal));
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
          onSubmit={ e => {
            if (disabled) {
              return;
            }
            e.preventDefault();
            this.props.onSubmit(this.getSearchParams());
          }}
        >
          <TextField
            className="SearchFilters-input"
            label="Location"
            placeholder="Select a location"
            block
            disabled={ disabled }
            name="search"
            ref="search"
            value={ searchParams.city }
            readOnly
            onKeyDown={ e => this.showLocationModal(e) }
            onClick={ e => this.showLocationModal(e) }
          />
          <TextField
            className="SearchFilters-input"
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
            label="Type"
            disabled={ disabled }
            ref="shout_type"
            name="shout_type"
            value={ shout_type }
            onChange={ shout_type => this.setState({ shout_type }) }
          >
            <option value="all">All shouts</option>
            <option value="offer">Only offers</option>
            <option value="request">Only requests</option>
          </Picker>
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
            <div className="SearchFilters-filters">
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
            <Button block primary size="small" disabled={ disabled || isEqual(this.state, this.props.searchParams) } type="submit" label="Search" />
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
