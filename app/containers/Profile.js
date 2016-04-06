import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import find from 'lodash/collection/find';

import { denormalize } from '../schemas';
import { loadProfileDetailsIfNeeded, loadUser, loadUserShouts } from '../actions/users';

import Page from '../layout/Page';
import SuggestedInterests from '../interests/SuggestedInterests';
import SuggestedProfiles from '../users/SuggestedProfiles';
import UserAvatar from '../users/UserAvatar';
import ProfileBiography from '../users/ProfileBiography';
import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';
import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';

import { getStyleBackgroundImage } from '../utils/DOMUtils';
import { getVariation } from '../utils/APIUtils';

if (process.env.BROWSER) {
  require('./Profile.scss');
}

const fetchData = (store, params) =>
  Promise.all([
    store.dispatch(loadUser(params.username)),
    store.dispatch(loadUserShouts({ user: params.username })),
  ]);

const requiredDetails = ['name', 'cover', 'bio', 'location'];

export class Profile extends Component {

  static propTypes = {
    shouts: PropTypes.array,
    profile: PropTypes.object,
    isFetchingShouts: PropTypes.bool,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params: { username } } = this.props;
    if (!firstRender) {
      dispatch(loadProfileDetailsIfNeeded({ username }, requiredDetails));
      dispatch(loadUserShouts({ user: username }));
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { username } } = this.props;
    const { params: { username: nextUsername } } = nextProps;
    if (nextUsername !== username) {
      dispatch(loadProfileDetailsIfNeeded({ username: nextUsername }, requiredDetails));
      dispatch(loadUserShouts({ user: nextUsername }));
    }
  }

  render() {
    const { profile, shouts, isFetchingShouts, shoutsCount, nextShoutsUrl, dispatch } = this.props;

    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextShoutsUrl && !isFetchingShouts) {
            dispatch(loadUserShouts({ user: profile.username }, nextShoutsUrl));
          }
        }}
        triggerOffset={ 400 }
      >
        <Page title="Profile"
          endColumn={ [<SuggestedInterests key="interests" />,
          <SuggestedProfiles key="profiles" />,
          <SuggestedShout key="shout" />] }
        >
          { !profile && <Progress animate /> }

          { profile &&
            <div className="Profile">
              <div className="Profile-cover" style={ getStyleBackgroundImage(profile.cover) } />

              <div className="Profile-header">
                <a href={ profile.image ? getVariation(profile.image, 'large') : '' }>
                  <UserAvatar size="huge" user={ profile } />
                </a>
                <div className="Profile-name">
                  <h1>
                    { profile.name }
                  </h1>
                  <h3>
                    { profile.username }
                  </h3>
                </div>
              </div>

              <div className="Profile-body">
                <div className="Profile-body-start-column">
                  <ProfileBiography profile={ profile } />
                </div>

                <div className="Profile-shouts">
                  <div>
                    { shouts.length > 0 &&
                      <h2>{ `${profile.isOwner ? 'Your' : `${profile.firstName}’s`} shouts (${shoutsCount})` }</h2>
                    }
                    { shouts.length > 0 &&
                      <ShoutsList shouts={ shouts } showProfile={ false } /> }
                    <Progress
                      animate={ isFetchingShouts }
                      label={ shouts.length === 0 ? 'Loading shouts…' : 'Loading more shouts…'} />
                  </div>
                  { !isFetchingShouts && shouts.length === 0 &&
                    <h2>{ `${profile.firstName} has no shouts, yet!` }</h2>
                  }

                </div>
              </div>

            </div>
          }
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const { params: { username } } = ownProps;
  const { paginated, entities } = state;
  const profile = find(entities.users, { username });
  let shouts = [];
  let isFetchingShouts = false;
  let shoutsCount = 0;
  let nextShoutsUrl;
  const shoutsByUsername = paginated.shoutsByUsername[username];
  if (shoutsByUsername) {
    isFetchingShouts = shoutsByUsername.isFetching;
    shoutsCount = shoutsByUsername.count;
    nextShoutsUrl = shoutsByUsername.nextUrl;
    shouts = shoutsByUsername.ids.map(id => denormalize(entities.shouts[id], entities, 'SHOUT'));
  }
  return {
    profile,
    shouts,
    shoutsCount,
    isFetchingShouts,
    nextShoutsUrl,
  };
};

export default connect(mapStateToProps)(Profile);
