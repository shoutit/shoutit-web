import React, { Component, PropTypes } from 'react';
import union from 'lodash/union';
import without from 'lodash/without';
import merge from 'lodash/merge';
import { connect } from 'react-redux';

import Expandable from '../widgets/Expandable';
import Switch from '../forms/Switch';

import { getCategory } from '../reducers/categories';

export class CategoryFilters extends Component {
  static propTypes = {
    categorySlug: PropTypes.string.isRequired,
    category: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    selectedFilters: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = this.getStateFromProps(props);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }
  getStateFromProps(props) {
    return {
      selectedFilters: this.mapFiltersToObject(props.selectedFilters) || {},
    };
  }
  mapFiltersToObject(arr) {
    if (!(arr instanceof Array)) {
      return arr;
    }
    const obj = {};
    arr.forEach(filter => {
      obj[filter.slug] = filter.value.slug.split(',');
    });
    return obj;
  }
  handleChange(filter, value, e) {
    let selectedFilters;
    if (e.target.checked) {
      selectedFilters = merge({}, this.state.selectedFilters, {
        [filter.slug]: union(this.state.selectedFilters[filter.slug], [value.slug]),
      });
    } else {
      selectedFilters = {
        ...this.state.selectedFilters,
        [filter.slug]: without(this.state.selectedFilters[filter.slug], value.slug),
      };
    }
    this.setState({ selectedFilters }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.selectedFilters, e);
      }
    });
  }
  render() {
    const { selectedFilters } = this.state;

    // Exclude filters with no values
    const filters = this.props.category.filters.filter(filter => filter.values.length > 0);

    if (filters.length === 0) {
      return null;
    }
    return (
      <div className="CategoryFilters FormField">
        { filters.map((filter, i) =>
          <Expandable
            key={ i }
            label={ filter.name }
            expand={ selectedFilters[filter.slug] && selectedFilters[filter.slug].length > 0 }>
            { filter.values.map(value =>
              <Switch
                onChange={ e => this.handleChange(filter, value, e) }
                id={ `${filter.slug}:${value.slug}` }
                name={ filter.slug }
                defaultValue={ value.slug }
                defaultChecked={ selectedFilters[filter.slug] && selectedFilters[filter.slug].indexOf(value.slug) > -1 }
                key={ value.slug }>{ value.name }</Switch>
              ) }
          </Expandable>
        ) }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  category: getCategory(state, ownProps.categorySlug),
});

export default connect(mapStateToProps)(CategoryFilters);
