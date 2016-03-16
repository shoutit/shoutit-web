import React from 'react';

import ProfileShoutList  from './tagProfileShoutList.jsx';

export default React.createClass({
  displayName: "TagProfileRequests",
  // 
  // statics: {
  //   fetchId: 'tagrequests',
  //   fetchData(client, session, params) {
  //     return client.tags().getShouts(session, params.tagName, 'request');
  //   }
  // },

  render() {
    return (
      <ProfileShoutList type="request" {...this.props}/>
    );
  }
});
