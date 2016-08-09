/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import { PaginationPropTypes } from '../utils/PropTypes';
import Device from '../utils/Device';

import Helmet from '../utils/Helmet';

import { getProfile } from '../reducers/entities/users';
import { getShoutsByUsername, getPaginationState } from '../reducers/paginated/shoutsByUsername';

import { loadProfileDetailsIfNeeded, loadShoutsByUsername } from '../actions/users';
import { routeError } from '../actions/server';

import Page, { EndColumn, Body } from '../layout/Page';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';
import ProfileCover from '../users/ProfileCover';
import ProfileBiography from '../users/ProfileBiography';
import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';

import Progress from '../widgets/Progress';
import Scrollable from '../layout/Scrollable';

import './Profile.scss';

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
    ...PaginationPropTypes,
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
    const { profile, shouts, isFetching, nextUrl, dispatch } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(loadShoutsByUsername(profile.username, nextUrl));
          }
        } }
        triggerOffset={ 400 }
      >
        <Page>
          { profile &&
            <Helmet
              title={ formatMessage(MESSAGES.title, { ...profile }) }
              description={ profile.bio }
              images={ [profile.image] }
              appUrl={ profile.appUrl }
              meta={ [
                { property: 'og:type', content: 'ogPrefix:user' },
                { property: 'ogPrefix:username', content: profile.username },
              ] }
            />
          }

          { !profile && <Progress animate /> }

          <Body>
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
                              values={ { count: this.props.count } }
                            /> :
                            <FormattedMessage
                              id="profile.others.shoutsList.header"
                              defaultMessage="{name}’s shouts ({count})"
                              values={ {
                                name: profile.name,
                                count: this.props.count,
                              } }
                            />
                          }
                        </h2>
                      }
                      { shouts.length > 0 && <ShoutsList shouts={ shouts } showProfile={ false } /> }

                      <Progress animate={ isFetching } />
                    </div>
                    { !isFetching && shouts.length === 0 &&
                      <h2>
                        <FormattedMessage
                          id="profile.others.shoutsList.noshouts"
                          defaultMessage="{name} has no shouts, yet!"
                          values={ { name: profile.name } }
                        />
                      </h2>
                    }

                  </div>
                </div>

              </div>
            }
          </Body>
          <Device type="desktop">
            <EndColumn footer>
              <SuggestedTags key="interests" />
              <SuggestedProfiles key="profiles" />
              <SuggestedShout key="shout" />
            </EndColumn>
          </Device>
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  profile: getProfile(state, ownProps.params.username),
  shouts: getShoutsByUsername(state, ownProps.params.username),
  ...getPaginationState(state, ownProps.params.username),
});

const Wrapped = connect(mapStateToProps)(injectIntl(Profile));
Wrapped.fetchData = Profile.fetchData;
export default Wrapped;
