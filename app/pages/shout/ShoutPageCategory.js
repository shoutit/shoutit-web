import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import CategoryListItem from '../../shouts/CategoryListItem';
import './ShoutPageCategory.scss';

class ShoutPageCategory extends Component {
  static propTypes = {
    shout: PropTypes.object.isRequired,
  }
  render() {
    const { shout } = this.props;
    return (
      <div className="ShoutPageCategory">
        <div>
          <h3>
            <FormattedMessage id="ShoutPageCategory.title" defaultMessage="Category" />
          </h3>
          <Link key={ shout.category.slug } to={ `/search?category=${shout.category.slug}` }>
            <CategoryListItem category={ shout.category } />
          </Link>
        </div>
        { shout.filters.map((filter, i) =>
          <div key={ i } >
            <h3>{ filter.name }</h3>
            <Link
              to={ `/search?category=${shout.category.slug}&filters=${filter.slug}:${filter.value.slug}` }
              className="ShoutPageCategory-Filters-value">
              { filter.value.name }
            </Link>
          </div>
        ) }
      </div>
    );
  }
}

export default ShoutPageCategory;
