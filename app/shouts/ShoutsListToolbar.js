import React, { Component, PropTypes } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import { getSortTypes } from '../reducers/sortTypes';

import Picker from '../forms/Picker';
import Progress from '../widgets/Progress';

import './ShoutsListToolbar.scss';

class ShoutsListToolbar extends Component {
  static propTypes = {
    sortTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number,
    sortType: PropTypes.string,
    showProgress: PropTypes.bool,
    onSortChange: PropTypes.func.isRequired,
  }
  render() {
    const { count } = this.props;
    return (
      <div className="ShoutsListToolbar">
        <div className="ShoutsListToolbar-count">
          <FormattedMessage
            id="shouts.ShoutsListToolbar.count"
            defaultMessage="{count, plural,
              zero {No Shouts found}
              one {{formattedCount} Shout found}
              two {{formattedCount} Shouts found}
              other {{formattedCount} Shouts found}
            }"
            values={ {
              count,
              formattedCount: (
                <span className="ShoutsListToolbar-countValue">
                  <FormattedNumber value={ count } />
                </span>
              ),
            } }
          />
        </div>
        <div>
          <Progress animate={ this.props.showProgress } />
        </div>
        <div>
          { !!count &&
            <div className="ShoutsListToolbar-form">
              <label htmlFor="ShoutsListToolbarSort">
                <FormattedMessage
                  id="shouts.ShoutsListToolbar.sortByLabel"
                  defaultMessage="Sort by"
                />
              </label>
              <Picker value={ this.props.sortType } name="sort" id="ShoutsListToolbarSort" onChange={ this.props.onSortChange }>
                { this.props.sortTypes.map(sortType =>
                  <option value={ sortType.type }>{ sortType.name }</option>
                ) }
              </Picker>
            </div>
          }
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  sortTypes: getSortTypes(state),
});

export default connect(mapStateToProps)(ShoutsListToolbar);
