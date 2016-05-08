import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from '../utils/Helmet';

import ShoutsList from '../shouts/ShoutsList';
import { denormalize } from '../schemas';

import { loadHomeShouts, loadListening } from '../actions/users';
import { routeError } from '../actions/server';

import Progress from '../ui/Progress';
import Page from '../layout/Page';
import Scrollable from '../ui/Scrollable';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import UIMessage from '../ui/UIMessage';
import Listening from '../users/Listening';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';

if (process.env.BROWSER) {
  require('./Dashboard.scss');
}

const fetchData = dispatch =>
  dispatch(loadHomeShouts())
    .catch(err => dispatch(routeError(err)));

const StartColumn = ({ profile }) =>
  <div className="Dashboard-start-column">
    <h1>
      Welcome back, { profile.firstName }
    </h1>

    <ul className="htmlNoList" style={ { padding: '0 .5rem' } }>
      <li>
        <Link to={ `/user/${profile.username}` }>
          <ListItem start={ <Icon active name="profile" size="small" /> }>Your Profile</ListItem>
        </Link>
      </li>
      <li>
        <Link to="/settings">
          <ListItem start={ <Icon active name="pencil" size="small" /> }>Edit Your Profile</ListItem>
        </Link>
      </li>
      <li>
        <Link to="/messages">
          <ListItem start={ <Icon active name="balloon-dots" size="small" /> }>Messages</ListItem>
        </Link>
      </li>
      <li>
        <Link to="/search">
          <ListItem start={ <Icon active name="world-west" size="small" /> }>Browse shouts</ListItem>
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
    profile: PropTypes.object,
    loggedProfile: PropTypes.object.isRequired,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch, loggedProfile, shouts } = this.props;
    if (!firstRender && shouts.length === 0) {
      fetchData(dispatch);
    }
    dispatch(loadListening(loggedProfile));
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
    const { shouts, nextUrl, dispatch, isFetching, loggedProfile, error } = this.props;
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
          startColumn={ <StartColumn profile={ loggedProfile } /> }
          stickyStartColumn
          endColumn={ [<SuggestedTags />, <SuggestedProfiles />, <SuggestedShout />] }>

          <Helmet title={ `${loggedProfile.firstName}’s Home Page` } />

          <ShoutsList shouts={ shouts } />

          { !isFetching && shouts.length === 0 &&
            <UIMessage title="No suggestions, yet" details="After some while, you will see some more suggested shouts here." />
           }

          <Progress
            animate={ isFetching }
            label={ shouts.length === 0 ? 'Loading shouts…' : 'Loading more shouts…' }
          />

          { !isFetching && error &&
            <UIMessage
              title="There was an error"
              details="Cannot load shouts right now."
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
  loggedProfile: state.entities.users[state.session.user],
  shouts: state.paginated.shoutsByHome.ids.map(id => denormalize(state.entities.shouts[id], state.entities, 'SHOUT')),
  nextUrl: state.paginated.shoutsByHome.nextUrl,
  isFetching: state.paginated.shoutsByHome.isFetching,
  error: state.paginated.shoutsByHome.error,
});

export default connect(mapStateToProps)(Dashboard);
