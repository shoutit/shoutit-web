import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../layout/Page';
import SuggestedShout from '../shouts/SuggestedShout';

// if (process.env.BROWSER) {
//   require('./Discover.scss');
// }

// const fetchData = () => {};

export class Discover extends Component {

  static propTypes = {
  };

  // static fetchData = fetchData;

  componentDidMount() {
  }

  render() {
    return (
      <Page title="Discover" endColumn={ <SuggestedShout /> }>
        Discover page
      </Page>
    );
  }

}

const mapStateToProps = () => ({ });

export default connect(mapStateToProps)(Discover);
