import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { FormattedMessage } from 'react-intl';

import Button from '../ui/Button';
import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import LocationRange from '../ui/LocationRange';
import CategoryPicker from '../ui/CategoryPicker';
import PriceField from '../ui/PriceField';
import TextField from '../ui/TextField';
import Label from '../ui/Label';
import Card, { CardSection } from '../ui/Card';

import ShoutTypeSegmentedControl from '../shouts/ShoutTypeSegmentedControl';

export class SearchFilters extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    searchParams: PropTypes.object,
    currentLocation: PropTypes.object,
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
    this.submit = this.submit.bind(this);
    this.debouncedSubmit = debounce(this.submit, 1000).bind(this);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(nextProps.searchParams, this.props.searchParams)) {
      return;
    }
    this.setState(this.getStateFromProps(nextProps));
  }

  getSearchParams() {
    const searchParams = {
      search: this.state.search || undefined,
      shout_type: this.state.shout_type,
      category: this.state.category,
      filters: this.state.filters,
      min_price: parseInt(this.state.min_price, 10) || undefined,
      max_price: parseInt(this.state.max_price, 10) || undefined,
      within: this.state.within || undefined,
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
      within: props.searchParams.within,
      filters: props.searchParams.filters || {},
    };
  }

  submit() {
    const { disabled, onSubmit } = this.props;
    if (disabled) {
      return;
    }
    onSubmit(this.getSearchParams());
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
    const { category, shout_type, min_price, max_price, search, filters } = this.state;
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
              filtersClassName="Form-inset-small"
              selectedCategorySlug={ category }
              selectedFilters={ filters }
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
            <Label>
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
                  autoComplete="off"
                  placeholder={ placeholder }
                  disabled={ disabled }
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
                  disabled={ disabled }
                  name="max_price"
                  value={ max_price }
                  onChange={ max_price => this.handleChange({ max_price }, { debounce: true }) }
                />
              }
            </FormattedMessage>
          </CardSection>
          <CardSection>
            <Button
              block
              kind="primary"
              disabled={ disabled || isEqual(this.state, this.props.searchParams) }
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
  categories: state.categories.ids.map(id => state.entities.categories[id]),
  currentLocation: state.currentLocation,
});

export default connect(mapStateToProps)(SearchFilters);
