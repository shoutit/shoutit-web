/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import Helmet from '../utils/Helmet';

import ShoutsList from '../shouts/ShoutsList';

import { loadHomeShouts, loadListeningProfiles } from '../actions/users';
import { routeError } from '../actions/server';

import Progress from '../widgets/Progress';
import Page from '../layout/Page';
import Scrollable from '../layout/Scrollable';
import Icon from '../widgets/Icon';
import ListItem from '../layout/ListItem';
import UIMessage from '../widgets/UIMessage';
import Listening from '../users/Listening';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';

import { getHomepageShouts, getPaginationState } from '../reducers/paginated/shoutsByHome';
import { getLoggedUser } from '../reducers/session';

import './Dashboard.scss';

const MESSAGES = defineMessages({
  title: {
    id: 'dashboard.page.title',
    defaultMessage: '{firstName}’s Home Page',
  },
});

const fetchData = dispatch =>
  dispatch(loadHomeShouts())
    .catch(err => dispatch(routeError(err)));

const StartColumn = ({ profile }) =>
  <div className="Dashboard-start-column">
    <h1>
      <FormattedMessage
        id="dashboard.welcome"
        defaultMessage="Welcome back, {firstName}"
        values={ { firstName: profile.firstName } }
      />
    </h1>

    <ul className="htmlNoList Dashboard-shortcuts" style={ { padding: '0 .5rem' } }>
      <li>
        <Link to={ `/user/${profile.username}` }>
          <ListItem start={ <Icon active name="profile" size="small" /> }>
            <FormattedMessage
              id="dashboard.menu.profile"
              defaultMessage="Your Profile"
            />
          </ListItem>
        </Link>
      </li>
      <li>
        <Link to="/settings">
          <ListItem start={ <Icon active name="pencil" size="small" /> }>
            <FormattedMessage
              id="dashboard.menu.editProfile"
              defaultMessage="Edit Your Profile"
            />
          </ListItem>
        </Link>
      </li>
      <li>
        <Link to="/messages">
          <ListItem start={ <Icon active name="balloon-dots" size="small" /> }>
            <FormattedMessage
              id="dashboard.menu.chat"
              defaultMessage="Messages"
            />
          </ListItem>
        </Link>
      </li>
      <li>
        <Link to="/search">
          <ListItem start={ <Icon active name="world-west" size="small" /> }>
            <FormattedMessage
              id="dashboard.menu.search"
              defaultMessage="Browse shouts"
            />
          </ListItem>
        </Link>
      </li>
    </ul>

    <Listening byProfile={ profile } />

  </div>;

StartColumn.propTypes = {
  profile: PropTypes.object.isRequired,
};

export class Dashboard extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    shouts: PropTypes.array.isRequired,
    searchString: PropTypes.string,
    nextUrl: PropTypes.string,
    firstRender: PropTypes.bool,
    isFetching: PropTypes.bool,
    searchParams: PropTypes.array,
    error: PropTypes.object,
    intl: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
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
    const title = formatMessage(MESSAGES.title, { firstName: profile.firstName });
    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(loadHomeShouts(nextUrl));
          }
        } }
        triggerOffset={ 400 }>
        <Page
          startColumn={ <StartColumn profile={ profile } /> }
          stickyStartColumn
          endColumn={ [<SuggestedTags />, <SuggestedProfiles />, <SuggestedShout />] }>

          <Helmet title={ title } />

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
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = state => ({
  profile: getLoggedUser(state),
  shouts: getHomepageShouts(state),
  ...getPaginationState(state),
});

const Wrapped = connect(mapStateToProps)(injectIntl(Dashboard));
Wrapped.fetchData = Dashboard.fetchData;
export default Wrapped;
