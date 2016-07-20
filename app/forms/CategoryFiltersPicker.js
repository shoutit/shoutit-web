import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Picker from '../forms/Picker';
import FieldsGroup from '../forms/FieldsGroup';

import './CategoryFiltersPicker.scss';

import { getCategory } from '../reducers/categories';

export class CategoryFilters extends Component {
  static propTypes = {
    categorySlug: PropTypes.string.isRequired,
    category: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    selectedFilters: PropTypes.array,
    disabled: PropTypes.bool,
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
    return { ...props.selectedFilters };
  }
  handleChange(filterSlug, valueId, e) {
    this.setState({
      [filterSlug]: valueId,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state, e);
      }
    });
  }
  render() {
    const { category, ...props } = this.props;
    // Exclude filters with no values
    const filters = category.filters.filter(filter => filter.values.length > 0);
    if (filters.length === 0) {
      return null;
    }
    return (
      <div className="CategoryFiltersPicker FormField">
        <FieldsGroup wrap>
          { filters.map(filter =>
            <Picker
              { ...props }
              value={ this.state[filter.slug] }
              name={ filter.slug }
              onChange={ (value, e) => this.handleChange(filter.slug, value, e) }>
              <option value="">{ filter.name }</option>
              { filter.values.map(value =>
                <option value={ value.id } key={ value.id }>
                  { value.name }
                </option>
              ) }
            </Picker>
          ) }
        </FieldsGroup>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  category: getCategory(state, ownProps.categorySlug),
});

export default connect(mapStateToProps)(CategoryFilters);
