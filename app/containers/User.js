import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../layout/Page';
import SuggestedInterests from '../interests/SuggestedInterests';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';

// if (process.env.BROWSER) {
//   require('./User.scss');
// }

// const fetchData = () => {};

export class User extends Component {

  static propTypes = {
  };

  // static fetchData = fetchData;

  componentDidMount() {
  }

  render() {
    return (
      <Page title="Profile" endColumn={ [
        <SuggestedInterests />,
        <SuggestedProfiles />,
        <SuggestedShout />,
      ]}>
        Profile page
      </Page>
    );
  }

}

const mapStateToProps = () => ({ });

export default connect(mapStateToProps)(User);
