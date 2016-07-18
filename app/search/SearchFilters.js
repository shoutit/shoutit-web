import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { FormattedMessage } from 'react-intl';

import { getCategories } from '../reducers/categories';
import { getCurrentLocation } from '../reducers/currentLocation';

import Button from '../forms/Button';
import Form from '../forms/Form';
import Switch from '../forms/Switch';
import LocationField from '../forms/LocationField';
import LocationRange from '../forms/LocationRange';
import CategoryPicker from '../forms/CategoryPicker';
import PriceField from '../forms/PriceField';
import TextField from '../forms/TextField';
import Label from '../forms/Label';
import Card, { CardSection } from '../layout/Card';

import ShoutTypeSegmentedControl from '../shouts/ShoutTypeSegmentedControl';

export class SearchFilters extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    query: PropTypes.object,
    currentLocation: PropTypes.object,
  }

  static defaultProps = {
    disabled: false,
  }

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.debouncedSubmit = debounce(this.submit, 1000).bind(this);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(nextProps.query, this.props.query)) {
      return;
    }
    this.setState(this.getStateFromProps(nextProps));
  }

  getQuery() {
    const query = {
      search: this.state.search || undefined,
      shout_type: this.state.shout_type,
      category: this.state.category,
      filters: this.state.filters,
      min_price: parseInt(this.state.min_price, 10) || undefined,
      max_price: parseInt(this.state.max_price, 10) || undefined,
      within: this.state.within || undefined,
      free: this.state.free || undefined,
    };
    return query;
  }

  getStateFromProps(props) {
    return {
      category: props.query.category || '',
      shout_type: props.query.shout_type || 'all',
      min_price: props.query.min_price || '',
      max_price: props.query.max_price || '',
      search: props.query.search || '',
      within: props.query.within,
      filters: props.query.filters || {},
      free: props.query.free || false,
    };
  }

  submit() {
    const { disabled, onSubmit } = this.props;
    if (disabled) {
      return;
    }
    onSubmit(this.getQuery());
  }

  handleChange(state, { debounce } = {}) {
    this.setState(state, () => {
      if (debounce) {
        this.debouncedSubmit();
      } else {
        this.submit();
      }
    });
    this.setState(state, debounce ? this.debouncedSubmit : this.submit);
  }

  render() {
    const { disabled, currentLocation } = this.props;
    const { category, shout_type, min_price, max_price, search } = this.state;
    return (
      <Card block>
        <Form onSubmit={ this.submit }>

          <CardSection>
            <ShoutTypeSegmentedControl
              value={ shout_type }
              disabled={ disabled }
              name="shout_type"
              onChange={ shout_type => this.handleChange({ shout_type }) }
            />
            <FormattedMessage
              id="searchFilters.search.placeholder"
              defaultMessage="Search by keyword"
            >
              { message =>
                <TextField
                  placeholder={ message }
                  disabled={ disabled }
                  name="search"
                  value={ search }
                  onChange={ search => this.handleChange({ search }, { debounce: true }) }
                />
              }
            </FormattedMessage>
            <LocationField name="location" />

            { currentLocation && currentLocation.city &&
              <LocationRange
                onChange={ within => this.handleChange({ within }, { debounce: true }) }
                name="within"
                value={ this.state.within }
                location={ currentLocation }
              /> }
          </CardSection>
          <CardSection separe>
            <CategoryPicker
              selectedCategorySlug={ category }
              selectedFilters={ this.state.filters }
              showFilters
              onChange={ (category, filters) =>
                this.handleChange({
                  category: category ? category.slug : '',
                  filters,
                })
              }
            />
          </CardSection>
          <CardSection separe>
            <Label htmlFor="searchFiltersMinPrice">
              <FormattedMessage
                id="searchFilters.priceRange.label"
                defaultMessage="Price Range"
              />
            </Label>

            <FormattedMessage
              id="searchFilters.minPrice.placeholder"
              defaultMessage="Min price"
            >
              { placeholder =>
                <PriceField
                  id="SearchFiltersMinPrice"
                  autoComplete="off"
                  placeholder={ placeholder }
                  disabled={ disabled || this.state.free }
                  name="min_price"
                  value={ min_price }
                  onChange={ min_price => this.handleChange({ min_price }, { debounce: true }) }
                />
              }
            </FormattedMessage>
            <FormattedMessage
              id="searchFilters.maxPrice.placeholder"
              defaultMessage="Max price"
            >
              { placeholder =>
                <PriceField
                  autoComplete="off"
                  className="SearchFilters-input"
                  placeholder={ placeholder }
                  disabled={ disabled || this.state.free }
                  name="max_price"
                  value={ max_price }
                  onChange={ max_price => this.handleChange({ max_price }, { debounce: true }) }
                />
              }
            </FormattedMessage>

            <Switch
              disabled={ disabled }
              checked={ this.state.free }
              type="checkbox"
              name="free"
              id="free"
              onChange={ e => this.handleChange({ free: e.target.checked }) }
            >
              <FormattedMessage
                id="search.SearchFilters.free.label"
                defaultMessage="Only Free Items"
              />
            </Switch>

            <Button
              block
              kind="primary"
              disabled={ disabled || isEqual(this.state, this.props.query) }
              type="submit">
              <FormattedMessage
                id="searchFilters.submitButton.label"
                defaultMessage="Search"
              />
            </Button>
          </CardSection>
        </Form>
      </Card>
    );
  }
}

SearchFilters.propTypes = {
  dispatch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const mapStateToProps = state => ({
  categories: getCategories(state),
  currentLocation: getCurrentLocation(state),
});

export default connect(mapStateToProps)(SearchFilters);
