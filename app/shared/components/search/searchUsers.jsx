import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import SearchUserList from './searchUserList.jsx';

export default React.createClass({
  mixins: [new FluxMixin(React), new StoreWatchMixin("users")],
  displayName: "SearchUsers",

  getStateFromFlux() {
    return this.getFlux().store("users").getState();
  },

  statics: {
    fetchData(client, session, params) {
      return client.users().search(session, {
        search: params.term,
        category: params.category,
        shout_type: params.shouttype
      });
    }
  },

  render() {
    let logged = this.state.user,
      loggedUser = logged ? this.state.users[logged] : null,
      listening = logged ? this.state.listening[logged] : null;

    return <SearchUserList{...this.props}
      listening={listening}
      loggedUser={loggedUser}
      />;
  }
});
