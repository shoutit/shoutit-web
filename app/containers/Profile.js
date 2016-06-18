/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import Helmet from '../utils/Helmet';

import { denormalize } from '../schemas';
import { loadProfileDetailsIfNeeded, loadShoutsByUsername } from '../actions/users';
import { routeError } from '../actions/server';

import Page from '../layout/Page';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';
import ProfileCover from '../users/ProfileCover';
import ProfileBiography from '../users/ProfileBiography';
import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';

import Progress from '../ui/Progress';
import Scrollable from '../ui/Scrollable';

if (process.env.BROWSER) {
  require('./Profile.scss');
}

const requiredDetails = ['name', 'cover', 'bio', 'location'];

const fetchData = (dispatch, state, params) => {
  const { username } = params;

  const profile = dispatch(loadProfileDetailsIfNeeded({ username }, requiredDetails))
    .catch(err => dispatch(routeError(err)));

  const shouts = dispatch(loadShoutsByUsername(username)).catch(() => {});
  return Promise.all([shouts, profile]);
};

const MESSAGES = defineMessages({
  title: {
    id: 'profile.page.title',
    defaultMessage: 'Shouts by {name}',
  },
});

export class Profile extends Component {

  static propTypes = {
    shouts: PropTypes.array,
    firstRender: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
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
    const { formatMessage } = this.props.intl;
    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextShoutsUrl && !isFetchingShouts) {
            dispatch(loadShoutsByUsername(profile.username, nextShoutsUrl));
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
              title={ formatMessage(MESSAGES.title, { ...profile }) }
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

              <div className="Profile-body">
                <div className="Profile-body-start-column">
                  <ProfileBiography profile={ profile } />
                </div>

                <div className="Profile-shouts">
                  <div>
                    { shouts.length > 0 &&
                      <h2>
                        { profile.isOwner ?
                          <FormattedMessage
                            id="profile.me.shoutsList.header"
                            defaultMessage="Your shouts ({count})"
                            values={ { count: shoutsCount } }
                          /> :
                          <FormattedMessage
                            id="profile.others.shoutsList.header"
                            defaultMessage="{firstName}’s shouts ({count})"
                            values={ { firstName: profile.firstName, count: shoutsCount } }
                          />
                        }
                      </h2>
                    }
                    { shouts.length > 0 && <ShoutsList shouts={ shouts } showProfile={ false } /> }

                    <Progress animate={ isFetchingShouts } />
                  </div>
                  { !isFetchingShouts && shouts.length === 0 &&
                    <h2>
                      <FormattedMessage
                        id="profile.others.shoutsList.noshouts"
                        defaultMessage="{firstName} has no shouts, yet!"
                        values={ { ...profile } }
                      />
                    </h2>
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

const Wrapped = injectIntl(connect(mapStateToProps)(Profile));
Wrapped.fetchData = Profile.fetchData;
export default Wrapped;
