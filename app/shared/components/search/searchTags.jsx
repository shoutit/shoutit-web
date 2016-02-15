import React from 'react';

import SearchTagList from './searchTagList.jsx';

export default React.createClass({
  displayName: "SearchTags",

  statics: {
    fetchData(client, session, params) {
      return client.tags().list(session, {
        search: params.term,
        category: params.category,
        shout_type: params.shouttype
      });
    }
  },

  render() {
    return (
      <SearchTagList {...this.props}/>
    );
  }
});
