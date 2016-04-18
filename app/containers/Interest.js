import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../layout/Page';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';

// if (process.env.BROWSER) {
//   require('./Interest.scss');
// }

// const fetchData = () => {};

export class Interest extends Component {

  static propTypes = {
  };

  // static fetchData = fetchData;

  componentDidMount() {
  }

  render() {
    return (
      <Page
        title="Explore interests"
        endColumn={ [
          <SuggestedTags />,
          <SuggestedProfiles />,
          <SuggestedShout />,
        ]}>
        Interest page
      </Page>
    );
  }

}

const mapStateToProps = () => ({ });

export default connect(mapStateToProps)(Interest);
