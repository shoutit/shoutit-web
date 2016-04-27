import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import find from 'lodash/collection/find';
import Helmet from '../utils/Helmet';

import { denormalize } from '../schemas';
import { loadProfileDetailsIfNeeded, loadUserShouts } from '../actions/users';
import { routeError } from '../actions/server';

import Page from '../layout/Page';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';
import ProfileCover from '../users/ProfileCover';
import ProfileAvatar from '../users/ProfileAvatar';
import ProfileBiography from '../users/ProfileBiography';
import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';
import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';

import { getVariation } from '../utils/APIUtils';

if (process.env.BROWSER) {
  require('./Profile.scss');
}

const requiredDetails = ['name', 'cover', 'bio', 'location'];

const fetchData = (dispatch, state, params) => {
  const { username } = params;

  const profile = dispatch(loadProfileDetailsIfNeeded({ username }, requiredDetails))
    .catch(err => dispatch(routeError(err)));

  const shouts = dispatch(loadUserShouts(username));
  return Promise.all([shouts, profile]);
};


export class Profile extends Component {

  static propTypes = {
    shouts: PropTypes.array,
    firstRender: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    profile: PropTypes.object,
    isFetchingShouts: PropTypes.bool,
    shoutsCount: PropTypes.number,
    nextShoutsUrl: PropTypes.string,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, {}, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { username } } = this.props;
    if (nextProps.params.username !== username) {
      fetchData(dispatch, {}, nextProps.params);
    }
  }

  render() {
    const { profile, shouts, isFetchingShouts, shoutsCount, nextShoutsUrl, dispatch } = this.props;

    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextShoutsUrl && !isFetchingShouts) {
            dispatch(loadUserShouts(profile.username, nextShoutsUrl));
          }
        } }
        triggerOffset={ 400 }
      >
        <Page
          endColumn={ [
            <SuggestedTags key="interests" />,
            <SuggestedProfiles key="profiles" />,
            <SuggestedShout key="shout" />,
          ] }
        >

          { profile &&
            <Helmet
              title={ `Shouts by ${profile.name}` }
              description={ profile.bio }
              images={ [profile.image] }
              meta={ [
                { property: 'og:type', content: 'shoutitcom:user' },
                { property: 'shoutitcom:username', content: profile.username },
              ] }
            />
          }

          { !profile && <Progress animate /> }

          { profile &&
            <div className="Profile">
              <ProfileCover profile={ profile } />
              <div className="Profile-header">
                <a href={ profile.image ? getVariation(profile.image, 'large') : '' }>
                  <ProfileAvatar size="huge" user={ profile } />
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
                    { (shoutsCount && shouts.length) > 0 &&
                      <h2>{ `${profile.isOwner ? 'Your' : `${profile.firstName}’s`} shouts (${shoutsCount})` }</h2>
                    }
                    { shouts.length > 0 &&
                      <ShoutsList shouts={ shouts } showProfile={ false } /> }
                    <Progress
                      animate={ isFetchingShouts }
                      label={ shouts.length === 0 ? 'Loading shouts…' : 'Loading more shouts…' } />
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
  const profile = denormalize(find(entities.users, { username }), entities, 'PROFILE');
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
