import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import Button from '../ui/Button';
import Form from '../ui/Form';
import LocationField from '../ui/LocationField';
import CategoryPicker from '../ui/CategoryPicker';
import SegmentedControl from '../ui/SegmentedControl';
import TextField from '../ui/TextField';

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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  getSearchParams() {
    const searchParams = {
      search: this.refs.search.getValue() || undefined,
      shout_type: this.refs.shout_type.getValue(),
      category: this.state.category,
      filters: this.state.filters,
      min_price: parseInt(this.refs.min_price.getValue(), 10) || undefined,
      max_price: parseInt(this.refs.max_price.getValue(), 10) || undefined,
    };
    if (Object.keys(searchParams).length === 0) {
      return null;
    }
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

  handleSubmit() {
    const { disabled, onSubmit } = this.props;
    if (disabled) {
      return;
    }
    onSubmit(this.getSearchParams());
  }

  render() {
    const { disabled } = this.props;
    const { category, shout_type, min_price, max_price, search, filters } = this.state;

    return (
      <div className="SearchFilters">
        <Form onSubmit={ this.handleSubmit }>

          <SegmentedControl value={ shout_type } disabled={ disabled } ref="shout_type" name="shout_type" options={ [
            { label: 'All', value: 'all' },
            { label: 'Offers', value: 'offer' },
            { label: 'Requests', value: 'request' },
          ] } onChange={ shout_type => this.setState({ shout_type }) } />

          <LocationField name="location" />

          <TextField
            placeholder="Search by keyword"
            disabled={ disabled }
            name="search"
            ref="search"
            value={ search }
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

          <div className="SearchFilters-price">
            <TextField
              autoComplete="off"
              className="SearchFilters-input"
              placeholder="Min price"
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
              disabled={ disabled }
              name="max_price"
              ref="max_price"
              value={ max_price }
              onChange={ max_price => this.setState({ max_price }) }
            />
          </div>

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
