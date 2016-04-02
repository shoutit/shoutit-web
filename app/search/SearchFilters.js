import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from '../ui/TextField';
import Picker from '../ui/Picker';
import Button from '../ui/Button';

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
      // min_price: parseInt(this.refs.min_price.value, 10) || undefined,
      // max_price: parseInt(this.refs.max_price.value, 10) || undefined,
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

  render() {
    const { categories, disabled } = this.props;
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
              <option value={slug }>
                { name }
              </option>
            )}
          </Picker>

          { filters.length > 0 &&
            <div className="SearchFilters-filters">
              { filters.map(filter =>
                  <span>
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
                        <option value={ value.slug }>{ value.name}</option>
                      )}
                    </Picker>
                  </span>
                )
              }
            </div>
          }

{/*
          <input
            disabled={ disabled }
            ref="min_price"
            placeholder="Min Price"
            value={ min_price }
            onChange={ e => this.setState({ min_price: e.target.value }) }
          />
          <input
            disabled={ disabled }
            ref="max_price"
            placeholder="Max Price"
            value={ max_price }
            onChange={ e => this.setState({ max_price: e.target.value }) }
          />*/}
          <div className="SearchFilters-buttons">
            <Button block primary size="small" disabled={ disabled } type="submit" label="Search" />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const categories = state.categories.ids.map(id => state.entities.categories[id]);
  return {
    categories,
  };
};
export default connect(mapStateToProps)(SearchFilters);
