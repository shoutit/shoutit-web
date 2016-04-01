import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Page from '../layout/Page';

import ShoutsList from '../shouts/ShoutsList';

import { loadHomeShouts } from '../actions/users';
import { denormalize } from '../schemas';
import Scrollable from '../ui/Scrollable';
import Button from '../ui/Button';
import SVGIcon from '../ui/SVGIcon';

const fetchData = store => store.dispatch(loadHomeShouts());

if (process.env.BROWSER) {
  require('./Dashboard.scss');
}
function StartColumn({ user }) {
  return (
    <div className="Dashboard-start-column">
      <h1>
        Welcome back, { user.firstName }
      </h1>
      <Button to="/profile/edit" size="small" block label="Edit your profile" leftIcon={ <SVGIcon active name="pencil" /> } />
      <Button to="/messages" size="small" block label="Your messages" leftIcon={ <SVGIcon active name="balloon-dots" /> } />
      <Button to="/search" size="small" block label="Browse shouts" leftIcon={ <SVGIcon active name="world-west" /> } />
    </div>
  );
}

export class Dashboard extends Component {

  static propTypes = {
    shouts: PropTypes.array,
    searchString: PropTypes.string,
    nextUrl: PropTypes.string,
    searchParams: PropTypes.array,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch } = this.props;
    if (!firstRender) {
      dispatch(loadHomeShouts());
    }
  }

  render() {
    const { shouts, nextUrl, dispatch, isFetching, loggedUser } = this.props;
    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(loadHomeShouts(nextUrl));
          }
        }}
      >
        <Page
          startColumn={ <StartColumn user={ loggedUser } /> }
          stickyStartColumn
          endColumn={ <div style={{ backgroundColor: 'red', height: 400 }}>Content</div> }
          stickyEndColumn
        >
          <ShoutsList shouts={ shouts } />
          { isFetching && <p>Loading...</p>}
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = state => {
  return {
    loggedUser: state.session.user,
    shouts: state.paginated.shoutsByHome.ids.map(id =>
      denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
    ),
    nextUrl: state.paginated.shoutsByHome.nextUrl,
    isFetching: state.paginated.shoutsByHome.isFetching,
  };
};

export default connect(mapStateToProps)(Dashboard);
