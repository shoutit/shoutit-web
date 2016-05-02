import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/lang/isEqual';

import Button from '../ui/Button';
import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import CategoryPicker from '../ui/CategoryPicker';
import SegmentedControl from '../ui/SegmentedControl';
import TextField from '../ui/TextField';

import { updateProfileLocation } from '../actions/users';
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
      category: this.state.category,
      filters: this.state.filters,
      min_price: parseInt(this.refs.min_price.getValue(), 10) || undefined,
      max_price: parseInt(this.refs.max_price.getValue(), 10) || undefined,
    };
    return searchParams;
  }

  getStateFromProps(props) {
    return {
      category: props.searchParams.category || '',
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
      dispatch(updateProfileLocation(location));
    }
  }

  render() {
    const { disabled, searchParams } = this.props;
    const { category, shout_type, min_price, max_price, search, filters } = this.state;

    return (
      <div className="SearchFilters">
        <Form
          onSubmit={ () => {
            if (disabled) {
              return;
            }
            this.props.onSubmit(this.getSearchParams());
          } }
        >
          <SegmentedControl value={ shout_type } disabled={ disabled } ref="shout_type" name="shout_type" options={ [
            { label: 'All', value: 'all' },
            { label: 'Offers', value: 'offer' },
            { label: 'Requests', value: 'request' },
          ] } onChange={ shout_type => this.setState({ shout_type }) } />

          <LocationField
            block
            inputRef={ el => { this.locationField = el; } }
            label="Location"
            name="location"
            location={ searchParams }
            onChange={ () => this.refs.submitButton.focus() }
          />
          <TextField
            label="Keywords"
            placeholder="Enter one or more keywords"
            block
            disabled={ disabled }
            name="search"
            ref="search"
            defaultValue={ search }
            onChange={ search => this.setState({ search }) }
          />

          <CategoryPicker
            filtersClassName="Form-inset-small"
            selectedCategorySlug={ category }
            selectedFilters={ filters }
            showFilters
            onChange={ (category, filters) =>
              this.setState({
                category: category ? category.slug : '',
                filters,
              })
            }
          />

          <TextField
            autoComplete="off"
            className="SearchFilters-input"
            placeholder="Min price"
            block
            label="Starting from price"
            disabled={ disabled }
            name="min_price"
            ref="min_price"
            defaultValue={ min_price }
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
            defaultValue={ max_price }
            onChange={ max_price => this.setState({ max_price }) }
          />

          <div className="SearchFilters-buttons">
            <Button ref="submitButton" block action="primary" size="small" disabled={ disabled || isEqual(this.state, this.props.searchParams) } type="submit">
              Search
            </Button>
          </div>
        </Form>
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
