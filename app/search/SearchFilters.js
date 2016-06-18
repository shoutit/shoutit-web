import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { FormattedMessage } from 'react-intl';

import ShoutTypeSegmentedControl from '../shouts/ShoutTypeSegmentedControl';
import Button from '../ui/Button';
import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import LocationRange from '../ui/LocationRange';
import CategoryPicker from '../ui/CategoryPicker';
import CurrencyField from '../ui/CurrencyField';
import TextField from '../ui/TextField';

if (process.env.BROWSER) {
  require('./SearchFilters.scss');
}

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
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit() {
    const { disabled, onSubmit } = this.props;
    if (disabled) {
      return;
    }
    onSubmit(this.getSearchParams());
  }

  render() {
    const { disabled, currentLocation } = this.props;
    const { category, shout_type, min_price, max_price, search, filters } = this.state;
    return (
      <div className="SearchFilters">
        <Form onSubmit={ this.handleSubmit }>

          <ShoutTypeSegmentedControl
            value={ shout_type }
            disabled={ disabled }
            name="shout_type"
            onChange={ shout_type => this.setState({ shout_type }) }
          />

          <LocationField name="location" />

          { currentLocation && currentLocation.city &&
            <LocationRange
              onChange={ within => this.setState({ within }) }
              name="within"
              value={ this.state.within }
              location={ currentLocation }
            /> }

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
                onChange={ search => this.setState({ search }) }
              />
            }
          </FormattedMessage>

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

          <div className="SearchFilters-price">
            <FormattedMessage
              id="searchFilters.minPrice.placeholder"
              defaultMessage="Min price"
            >
              { message =>
                <CurrencyField
                  autoComplete="off"
                  className="SearchFilters-input"
                  placeholder={ message }
                  disabled={ disabled }
                  name="min_price"
                  value={ min_price }
                  onChange={ min_price => this.setState({ min_price }) }
                />
              }
            </FormattedMessage>
            <FormattedMessage
              id="searchFilters.maxPrice.placeholder"
              defaultMessage="Max price"
            >
              { message =>
                <CurrencyField
                  autoComplete="off"
                  className="SearchFilters-input"
                  placeholder={ message }
                  disabled={ disabled }
                  name="max_price"
                  value={ max_price }
                  onChange={ max_price => this.setState({ max_price }) }
                />
              }
            </FormattedMessage>

          </div>

          <div className="SearchFilters-buttons">
            <Button
              block
              action="primary"
              size="small"
              disabled={ disabled || isEqual(this.state, this.props.searchParams) }
              type="submit">
              <FormattedMessage
                id="searchFilters.submitButton.label"
                defaultMessage="Search"
              />
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
  currentLocation: state.currentLocation,
});

export default connect(mapStateToProps)(SearchFilters);
