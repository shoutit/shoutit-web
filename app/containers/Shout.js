import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadShout } from '../actions/shouts';
import { routeError } from '../actions/server';

import Page from '../layout/Page';
import SuggestedInterests from '../interests/SuggestedInterests';
import ProfileOverlay from '../users/ProfileOverlay';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';
import Card from '../ui/Card';
import GoogleStaticMap from '../location/GoogleStaticMap';

import { denormalize } from '../schemas';

// if (process.env.BROWSER) {
//   require('./User.scss');
// }

const fetchData = (dispatch, state, params) =>
  dispatch(loadShout(params.id)).catch(err => dispatch(routeError(err)));

export class Shout extends Component {

  static propTypes = {
    shout: PropTypes.object,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, {}, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { id } } = this.props;
    if (nextProps.params.id !== id) {
      fetchData(dispatch, {}, nextProps.params);
    }
  }

  renderStartColumn() {
    const { shout } = this.props;
    if (!shout) {
      return null;
    }
    return (
      <div>
        { shout.location &&
        <Card block>
          <GoogleStaticMap location={ shout.location } />
        </Card>
        }
        <Card block>
          <ProfileOverlay style={{ width: '100%' }} id={ shout.profile.id } />
        </Card>
      </div>
    );
  }

  render() {
    const { shout } = this.props;

    return (
      <Page title="Shout"
        startColumn={ this.renderStartColumn() }
        endColumn={ [
          <SuggestedInterests />,
          <SuggestedProfiles />,
          <SuggestedShout />,
        ]}>
        Shout page

        { !shout && <p>Loading...</p>}

        { shout && shout.title }
      </Page>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  shout: state.entities.shouts[ownProps.params.id] ? denormalize(state.entities.shouts[ownProps.params.id], state.entities, 'SHOUT') : undefined,
});

export default connect(mapStateToProps)(Shout);
