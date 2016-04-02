import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import ShoutsList from '../shouts/ShoutsList';

import { loadHomeShouts, loadListening } from '../actions/users';
import { denormalize } from '../schemas';
import Progress from '../ui/Progress';
import Page from '../layout/Page';
import Scrollable from '../ui/Scrollable';
import Button from '../ui/Button';
import SVGIcon from '../ui/SVGIcon';
import UIMessage from '../ui/UIMessage';
import Listening from '../users/Listening';
import SuggestedInterests from '../interests/SuggestedInterests';
import SuggestedProfiles from '../users/SuggestedProfiles';

if (process.env.BROWSER) {
  require('./Dashboard.scss');
}

const fetchData = store => {
  return store.dispatch(loadHomeShouts());
};

const StartColumn = ({ profile }) =>
  <div className="Dashboard-start-column">
    <h1>
      Welcome back, { profile.firstName }
    </h1>
    <Button to="/profile/edit" size="small" block label="Edit your profile" leftIcon={ <SVGIcon active name="pencil" /> } />
    <Button to="/messages" size="small" block label="Your messages" leftIcon={ <SVGIcon active name="balloon-dots" /> } />
    <Button to="/search" size="small" block label="Browse shouts" leftIcon={ <SVGIcon active name="world-west" /> } />
    <Listening byProfile={ profile } />
  </div>;

const EndColumn = () =>
  <div className="Dashboard-end-column">
    <SuggestedInterests />
    <SuggestedProfiles />
  </div>;

export class Dashboard extends Component {

  static propTypes = {
    shouts: PropTypes.array.isRequired,
    searchString: PropTypes.string,
    nextUrl: PropTypes.string,
    searchParams: PropTypes.array,
    loggedProfile: PropTypes.object.isRequired,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch, loggedProfile, nextUrl, shouts } = this.props;
    if (!firstRender) {
      if (shouts.length === 0) {
        dispatch(loadHomeShouts(nextUrl));
      }
      dispatch(loadListening(loggedProfile));
    }
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
        }}
        triggerOffset={ 400 }
      >
        <Page
          startColumn={ <StartColumn profile={ loggedProfile } /> }
          stickyStartColumn
          endColumn={ <EndColumn /> }
        >
          <ShoutsList shouts={ shouts } />

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
  loggedProfile: state.session.user,
  shouts: state.paginated.shoutsByHome.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  ),
  nextUrl: state.paginated.shoutsByHome.nextUrl,
  isFetching: state.paginated.shoutsByHome.isFetching,
  error: state.paginated.shoutsByHome.error,
});

export default connect(mapStateToProps)(Dashboard);
