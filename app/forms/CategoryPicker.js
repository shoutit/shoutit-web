import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getCategories } from '../reducers/categories';

import Picker from '../forms/Picker';
import TagIcon from '../tags/TagIcon';

export class CategoryPicker extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    className: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    selectedCategorySlug: PropTypes.string,
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
      selectedCategory: this.findCategory(props.selectedCategorySlug),
    };
  }
  field = null
  findCategory(slug) {
    return this.props.categories.find(category => category.slug === slug) || '';
  }
  focus() {
    this.field.focus();
  }
  blur() {
    this.field.blur();
  }
  select() {
    this.field.select();
  }
  handleChange(slug, e) {
    const selectedCategory = this.findCategory(slug);
    this.setState({ selectedCategory }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.selectedCategory.slug, e);
      }
    });
  }
  render() {
    const className = classNames('CategoryPicker FormField', this.props.className);
    const { selectedCategory } = this.state;
    return (
      <div className={ className }>

        <FormattedMessage
          id="forms.CategoryPicker.allCategories"
          defaultMessage="All Categories">
          { allCategoriesMessage =>
            <Picker
              startElement={ selectedCategory.icon && <TagIcon tag={ selectedCategory } /> }
              disabled={ this.props.disabled }
              label={ this.props.label }
              ref={ el => { this.field = el; } }
              name="category"
              value={ selectedCategory && selectedCategory.slug }
              onChange={ this.handleChange }>
              <option value="">{ allCategoriesMessage }</option>
              { this.props.categories.map(({ slug, name }) =>
                <option value={ slug } key={ slug }>
                  { name }
                </option>
              ) }
            </Picker>
          }
        </FormattedMessage>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: getCategories(state),
});

export default connect(mapStateToProps)(CategoryPicker);
