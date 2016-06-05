import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Overlay from '../ui/Overlay';
import ShoutListItem from '../shouts/ShoutListItem';
import TagListItem from '../tags/TagListItem';
import ProfileListItem from '../users/ProfileListItem';
import List from '../ui/List';
import Progress from '../ui/Progress';

import { getShouts, getTags, getProfiles, isFetching, hasMoreShouts } from '../reducers/search';

if (process.env.BROWSER) {
  require('./SearchOverlay.scss');
}

export class SearchOverlay extends Component {

  static propTypes = {
    query: PropTypes.string,
    shouts: PropTypes.array.isRequired,
    profiles: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    isFetching: PropTypes.bool,
    hasMoreShouts: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    onMoreShoutsClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    query: '',
    isFetching: false,
  }

  render() {
    const { query, shouts, tags, profiles, isFetching, hasMoreShouts, ...overlayProps } = this.props;
    const hasResults = shouts.length > 0 || tags.length > 0 || profiles.length > 0;
    let className = 'SearchOverlay';
    if (hasResults) {
      className += ' has-results';
    }
    return (
      <Overlay {...overlayProps}>
        <div className={ className }>
          { !query &&
            <div className="SearchOverlay-placeholder">
              Type something to start search.
            </div>
          }
          { query && !hasResults && !isFetching &&
            <div className="SearchOverlay-placeholder">
              Nothing found.
            </div>
          }
          { query && !hasResults && isFetching &&
            <Progress size="small" animate />
          }
          { query && hasResults &&
            <div className="SearchOverlay-results">
              { shouts.length > 0 &&
                <List title="Shouts">
                  { shouts.map(shout => <ShoutListItem onClick={ this.props.onHide } shout={ shout } key={ shout.id } />) }
                </List>
              }
              { shouts.length > 0 && hasMoreShouts &&
                <span className="SearchOverlay-more" onClick={ this.props.onMoreShoutsClick }>
                  See more…
                </span>
              }
              { profiles.length > 0 &&
                <List title="Profiles">
                  { profiles.map(profile => (
                    <ProfileListItem
                      size="medium"
                      onClick={ this.props.onHide }
                      key={ profile.id }
                      popover={ false }
                      profile={ profile } />
                    )) }
                </List>
              }
              { tags.length > 0 &&
                <List title="Interests">
                { tags.map(tag => (
                  <TagListItem
                    block
                    popover={ false }
                    onClick={ this.props.onHide }
                    tag={ tag }
                    key={ tag.id }
                    />
                )) }
                </List>
              }
            </div>
          }
        </div>
      </Overlay>

    );
  }
}

const mapStateToProps = state => ({
  shouts: getShouts(state),
  profiles: getProfiles(state),
  tags: getTags(state),
  isFetching: isFetching(state),
  hasMoreShouts: hasMoreShouts(state),
});

export default connect(mapStateToProps)(SearchOverlay);
