import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import union from 'lodash/union';
import without from 'lodash/without';
import merge from 'lodash/merge';

import { getCategories } from '../reducers/categories';

import Label from './Label';
import Expandable from '../widgets/Expandable';
import Switch from './Switch';
import Picker from './Picker';
import TagIcon from '../tags/TagIcon';

export class CategoryPicker extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,

    className: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    filtersClassName: PropTypes.string,
    inputRef: PropTypes.func,
    onChange: PropTypes.func,
    selectedCategorySlug: PropTypes.string,
    selectedFilters: PropTypes.object,
    showFilters: PropTypes.bool,
  }
  static defaultProps = {
    showFilters: true,
    disabled: false,
  }
  constructor(props) {
    super(props);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.state = {
      selectedCategory: this.findCategory(props.selectedCategorySlug),
      selectedFilters: this.mapFiltersToObject(props.selectedFilters),
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedCategory: this.findCategory(nextProps.selectedCategorySlug),
      selectedFilters: this.mapFiltersToObject(nextProps.selectedFilters),
    });
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
  findCategory(slug) {
    return this.props.categories.find(category => category.slug === slug) || '';
  }
  focus() {
    this.refs.field.focus();
  }
  blur() {
    this.refs.field.blur();
  }
  select() {
    this.refs.field.select();
  }
  handleCategoryChange(slug, e) {
    const selectedCategory = this.findCategory(slug);
    this.setState({ selectedCategory, selectedFilters: {} }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.selectedCategory, this.state.selectedFilters, e);
      }
    });
  }
  handleFilterChange(filter, value, e) {
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
        this.props.onChange(this.state.selectedCategory, this.state.selectedFilters, e);
      }
    });
  }
  render() {
    const { categories, disabled, showFilters, className, filtersClassName, label, inputRef } = this.props;
    const { selectedCategory, selectedFilters } = this.state;
    let filters = [];
    if (showFilters && selectedCategory && selectedCategory.filters) {
      filters = selectedCategory.filters.filter(filter => filter.values.length > 0);
    }
    let cssClass = 'CategoryPicker FormField';

    if (className) {
      cssClass += ` ${className}`;
    }
    return (
      <div className={ cssClass } ref={ () => { inputRef ? inputRef(this) : null; } }>
        <Picker
          startElement={ selectedCategory.icon && <TagIcon tag={ selectedCategory } /> }
          className="SearchFilters-input"
          block
          label={ label }
          disabled={ disabled }
          ref="category"
          name="category"
          value={ selectedCategory && selectedCategory.slug }
          onChange={ this.handleCategoryChange }
        >
          <option value="">All categories</option>
          { categories.map(({ slug, name }) =>
            <option value={ slug } key={ slug }>
              { name }
            </option>
          ) }
        </Picker>

        { filters.length > 0 &&
          <div className={ filtersClassName } style={ { marginTop: '.5em' } }>
            { filters.map((filter, i) =>
              <Expandable key={ i } label={ filter.name } expand={ selectedFilters[filter.slug] && selectedFilters[filter.slug].length > 0 }>
                { filter.values.map(value =>
                  <Switch
                    onChange={ e => this.handleFilterChange(filter, value, e) }
                    id={ `${filter.slug}:${value.slug}` }
                    name={ filter.slug }
                    value={ value.slug }
                    checked={ selectedFilters[filter.slug] && selectedFilters[filter.slug].indexOf(value.slug) > -1 }
                    key={ value.slug }>{ value.name }</Switch>
                  ) }
              </Expandable>
            ) }
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: getCategories(state),
});

export default connect(mapStateToProps)(CategoryPicker);
