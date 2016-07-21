import React, { Component, PropTypes } from 'react';

import CategoryListItem from '../../shouts/CategoryListItem';

import { Link } from 'react-router';
import './ShoutCategory.scss';

class ShoutDetails extends Component {
  static propTypes = {
    shout: PropTypes.object.isRequired,
  }
  render() {
    const { shout } = this.props;
    return (
      <div className="ShoutDetails">
        <div>
          <h3>Category</h3>
          <Link key={ shout.category.slug } to={ `/search?category=${shout.category.slug}` }>
            <CategoryListItem category={ shout.category } />
          </Link>
        </div>
        { shout.filters.map((filter) =>
          <div>
            <h3>{ filter.name }</h3>
            <Link
              to={ `/search?category=${shout.category.slug}&filters=${filter.slug}:${filter.value.slug}` }
              className="ShoutDetails-Filters-value">
              { filter.value.name }
            </Link>
          </div>
        ) }
      </div>
    );
  }
}

export default ShoutDetails;
