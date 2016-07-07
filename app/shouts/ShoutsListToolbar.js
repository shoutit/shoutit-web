import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSortTypes } from '../reducers/sortTypes';

import Picker from '../forms/Picker';

import './ShoutsListToolbar.scss';

class ShoutsListToolbar extends Component {
  static propTypes = {
    sortTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number,
    onSortChange: PropTypes.func.isRequired,
  }
  render() {
    const { count } = this.props;
    return (
      <div className="ShoutsListToolbar">
        <div className="ShoutsListToolbar-counter">
          <FormattedMessage
            id="shouts.ShoutsListToolbar.count"
            defaultMessage="{ count } Shouts found"
            values={ { count } }
          />
        </div>

        <div className="ShoutsListToolbar-form">
          <label htmlFor="ShoutsListToolbarSort">
            <FormattedMessage
              id="shouts.ShoutsListToolbar.sortByLabel"
              defaultMessage="Sort by"
            />
          </label>
          <Picker name="sort" id="ShoutsListToolbarSort" onChange={ this.props.onSortChange }>
            { this.props.sortTypes.map(sortType =>
              <option value={ sortType.type }>{ sortType.name }</option>
            ) }
          </Picker>
        </div>

      </div>
    );
  }
}
const mapStateToProps = state => ({
  sortTypes: getSortTypes(state),
});

export default connect(mapStateToProps)(ShoutsListToolbar);
