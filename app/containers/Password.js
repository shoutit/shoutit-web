import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../layout/Page';

// if (process.env.BROWSER) {
//   require('./Interest.scss');
// }

// const fetchData = () => {};

export class Password extends Component {

  static propTypes = {
  };

  // static fetchData = fetchData;

  componentDidMount() {
  }

  render() {
    return (
      <Page title="Password recovery">
        Password page
      </Page>
    );
  }

}

const mapStateToProps = () => ({ });

export default connect(mapStateToProps)(Password);
