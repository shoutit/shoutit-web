import React, { Component } from 'react';
import DocumentTitle from '../ui/DocumentTitle';
import { connect } from 'react-redux';

import { getServerStatus } from '../actions/server';

export class Heartbeat extends Component {

  static fetchData = dispatch => dispatch(getServerStatus());

  render() {
    const { status } = this.props;
    // Document's title is used by new relics
    return (
      <DocumentTitle title="Alive!">
        <div>
          <div style={{ fontSize: 128, textAlign: 'center', padding: '4rem' }}>
            ❤️
          </div>
          <pre style={{ textAlign: 'center', margin: '0 auto', padding: '1rem', backgroundColor: 'white' }}>
            Shoutit { status.tag }
          </pre>
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = state => ({
  status: state.server.status,
});
export default connect(mapStateToProps)(Heartbeat);
