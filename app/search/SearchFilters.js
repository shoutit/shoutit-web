import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { trimWhitespaces } from '../utils/StringUtils';

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
      search: trimWhitespaces(this.refs.search.value) || undefined,
      shout_type: this.refs.shout_type.value,
      category: this.refs.category.value,
      min_price: parseInt(this.refs.min_price.value, 10) || undefined,
      max_price: parseInt(this.refs.max_price.value, 10) || undefined,
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
    };
  }

  render() {
    const { categories, disabled } = this.props;
    const { category, shout_type, min_price, max_price, search } = this.state;
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
          <h3>Refine your search</h3>

          <input
            disabled={ disabled }
            name="search"
            ref="search"
            value={ search }
            onChange={ e => this.setState({ search: e.target.value }) }
          />

          <select
            disabled={ disabled }
            ref="shout_type"
            name="shout_type"
            value={ shout_type }
            onChange={ e => this.setState({ shout_type: e.target.value }) }
          >
            <option value="all">All shouts</option>
            <option value="offer">Only offers</option>
            <option value="request">Only requests</option>
          </select>

          <select
            disabled={ disabled }
            ref="category"
            name="category"
            value={ category }
            onChange={ e => this.setState({ category: e.target.value }) }
          >
            <option value="all">All categories</option>
            { categories.map(({ slug, name }) =>
              <option value={slug }>
                { name }
              </option>
            )}
          </select>

          { category && category.filters &&
            category.filters.map(filter =>
              <select name={ filter.slug } disabled={ disabled }>
                <option>{ filter.name }</option>
                { filter.values.map(value =>
                  <option value={ value.slug }>{ value.name}</option>
                )}
              </select>
            )
          }

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
          />

          <button disabled={ disabled } type="submit">Confirm</button>
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
