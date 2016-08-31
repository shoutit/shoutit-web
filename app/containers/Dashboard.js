/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { PaginationPropTypes } from '../utils/PropTypes';

import Helmet from '../utils/Helmet';

import ShoutsList from '../shouts/ShoutsList';

import { loadHomeShouts, loadListeningProfiles } from '../actions/users';
import { routeError } from '../actions/server';

import Progress from '../widgets/Progress';
import Page, { StartColumn, EndColumn, Body } from '../layout/Page';
import Scrollable from '../layout/Scrollable';
import Icon from '../widgets/Icon';
import ListItem from '../layout/ListItem';
import { PanelList } from '../layout/Panel';
import UIMessage from '../widgets/UIMessage';
import Listening from '../users/Listening';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';

import { getHomepageShouts, getPaginationState } from '../reducers/paginated/shoutsByHome';
import { getLoggedProfile } from '../reducers/session';

const MESSAGES = defineMessages({
  title: {
    id: 'dashboard.page.title',
    defaultMessage: '{name}’s Home Page',
  },
});

const fetchData = dispatch =>
  dispatch(loadHomeShouts())
    .catch(err => dispatch(routeError(err)));

export class Dashboard extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    shouts: PropTypes.array.isRequired,
    searchString: PropTypes.string,
    firstRender: PropTypes.bool,
    searchParams: PropTypes.array,
    error: PropTypes.object,
    intl: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    ...PaginationPropTypes,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch, profile, shouts } = this.props;
    if (!firstRender && shouts.length === 0) {
      fetchData(dispatch);
    }
    dispatch(loadListeningProfiles(profile));
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.loggedUser) {
      // When logging out, react-router getComponent() won't run before updating the page
      // Returning false will prevent updating the container when not logged in
      return false;
    }
    return true;
  }

  render() {
    const { shouts, nextUrl, dispatch, isFetching, profile, error } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(MESSAGES.title, profile);
    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(loadHomeShouts(nextUrl));
          }
        } }
        triggerOffset={ 400 }>
        <Page>
          <Helmet title={ title } />
          <StartColumn sticky>
            <h2>
              <FormattedMessage
                id="dashboard.welcome"
                defaultMessage="Welcome back, {name}"
                values={ profile }
              />
            </h2>

            <PanelList>
              <Link to={ `/user/${profile.username}` }>
                <ListItem start={ <Icon active name="profile" size="small" /> }>
                  <FormattedMessage
                    id="dashboard.menu.profile"
                    defaultMessage="Your Profile"
                  />
                </ListItem>
              </Link>
              <Link to="/settings">
                <ListItem start={ <Icon active name="pencil" size="small" /> }>
                  <FormattedMessage
                    id="dashboard.menu.editProfile"
                    defaultMessage="Edit Your Profile"
                  />
                </ListItem>
              </Link>
              <Link to="/messages">
                <ListItem start={ <Icon active name="balloon-dots" size="small" /> }>
                  <FormattedMessage
                    id="dashboard.menu.chat"
                    defaultMessage="Messages"
                  />
                </ListItem>
              </Link>
              <Link to="/search">
                <ListItem start={ <Icon active name="world-west" size="small" /> }>
                  <FormattedMessage
                    id="dashboard.menu.search"
                    defaultMessage="Browse shouts"
                  />
                </ListItem>
              </Link>
            </PanelList>
            <Listening byProfile={ profile } />
          </StartColumn>
          <Body>
            <ShoutsList shouts={ shouts } />

            { !isFetching && shouts.length === 0 &&
              <UIMessage
                title={
                  <FormattedMessage
                    id="dashboard.shouts.noShoutsTitle"
                    defaultMessage="No suggestions, yet."
                  />
                }
                details={
                  <FormattedMessage
                    id="dashboard.shouts.noShoutsDetails"
                    defaultMessage="After some while, you will see some more suggested shouts here."
                  />
                }
              />
            }

            <Progress animate={ isFetching } />

            { !isFetching && error &&
              <UIMessage
                title={
                  <FormattedMessage
                    id="dashboard.shouts.errorTitle"
                    defaultMessage="There was an error"
                  />
                }
                details={
                  <FormattedMessage
                    id="dashboard.shouts.errorDetails"
                    defaultMessage="Cannot load shouts right now – please try again."
                  />
                }
                type="error"
                retryAction={ () => dispatch(loadHomeShouts(nextUrl)) }
              />
            }
          </Body>
          <EndColumn>
            <SuggestedTags />
            <SuggestedProfiles />
            <SuggestedShout />
          </EndColumn>
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = state => ({
  profile: getLoggedProfile(state),
  shouts: getHomepageShouts(state),
  ...getPaginationState(state),
});

const Wrapped = connect(mapStateToProps)(injectIntl(Dashboard));
Wrapped.fetchData = Dashboard.fetchData;
export default Wrapped;
