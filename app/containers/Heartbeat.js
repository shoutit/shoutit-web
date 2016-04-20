import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Helmet from '../utils/Helmet';

import { getServerStatus } from '../actions/server';

export class Heartbeat extends Component {

  static fetchData = dispatch => dispatch(getServerStatus());

  static propTypes = {
    status: PropTypes.object.isRequired,
  }

  render() {
    const { status } = this.props;
    // Document's title is used by new relics
    return (
      <div>
        <Helmet title="Alive!" />
        <div style={{ fontSize: 128, textAlign: 'center', padding: '4rem' }}>
          ❤️
        </div>
        <pre style={{ textAlign: 'center', margin: '0 auto', padding: '1rem', backgroundColor: 'white' }}>
          Shoutit { status.tag }
        </pre>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  status: state.server.status,
});
export default connect(mapStateToProps)(Heartbeat);
