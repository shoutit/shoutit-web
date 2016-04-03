import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../layout/Page';

// if (process.env.BROWSER) {
//   require('./Interest.scss');
// }

// const fetchData = () => {};

export class Signup extends Component {

  static propTypes = {
  };

  // static fetchData = fetchData;

  componentDidMount() {
  }

  render() {
    return (
      <Page title="Signup">
        Signup page
      </Page>
    );
  }

}

const mapStateToProps = () => ({ });

export default connect(mapStateToProps)(Signup);
