import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import Picker from './Picker';

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
  getSelectedCategory() {
    return this.state.selectedCategory;
  }
  getSelectedFilters() {
    const { selectedFilters } = this.state;
    const filterArray = Object.keys(selectedFilters).map(key => ({
      slug: key,
      value: {
        slug: selectedFilters[key],
      },
    }));
    return filterArray;
  }
  mapFiltersToObject(arr) {
    if (!(arr instanceof Array)) {
      return arr;
    }
    const obj = {};
    arr.forEach(filter => {
      obj[filter.slug] = filter.value.slug;
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
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        [filter.slug]: value,
      },
    }, () => {
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
    let cssClass = 'CategoryPicker';

    if (className) {
      cssClass += ` ${className}`;
    }
    return (
      <div className={ cssClass } ref={ () => { inputRef ? inputRef(this) : null; } }>
        <Picker
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
            { filters.map(filter =>
              <span key={ filter.name }>
                <Picker
                  className="SearchFilters-input"
                  block
                  label={ filter.name }
                  name={ filter.slug }
                  disabled={ disabled }
                  value={ selectedFilters[filter.slug] || '' }
                  onChange={ value => this.handleFilterChange(filter, value) }>
                  <option value="">All</option>
                  { filter.values.map(value =>
                    <option value={ value.slug } key={ value.slug }>{ value.name }</option>
                  ) }
                </Picker>
              </span>
            ) }
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories.ids.map(id => state.entities.categories[id]),
});

export default connect(mapStateToProps)(CategoryPicker);
