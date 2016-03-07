import React from 'react';

import ProfileShoutList from './tagProfileShoutList.jsx';

export default React.createClass({
  displayName: "TagProfileOffers",

  statics: {
    fetchId: 'tagoffers',
    fetchData(client, session, params) {
      return client.shouts().list(session, params);
    }
  },

  render() {
    return (
      <ProfileShoutList type="offer" {...this.props}/>
    );
  }
});
