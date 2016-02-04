import React from "react";
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column, Progress} from "../helper";
import ProfileOffers from "./profileOffers.jsx";
import DocumentTitle from "react-document-title";
import ProfileCover from "./profileCover.jsx";
import ProfileLeftBoard from "./profileLeftBoard.jsx";
import assign from "lodash/object/assign";
import EmbeddedShout from "../shouting/embeddedShout.jsx";
import NotificationSystem from "react-notification-system";


export default React.createClass({
  displayName: "Profile",
  mixins: [new StoreWatchMixin("users")],

  _notificationSystem: null,

  // Use this to keep track of the latest loaded user through params
  lastLoadedUser: null,

  // Need to move it later to profileOffers after moving this path to home route path
  statics: {
    fetchId: 'useroffers',
    fetchData(client, session, params) {
      return client.users().getShouts(session, params.username, 'offer');
    }
  },

  getInitialState() {
    return {
      editMode: false,
      edited: {},
      uploading: null
    }
  },

  getStateFromFlux() {
    let users = this.props.flux.store("users").getState();
    return JSON.parse(JSON.stringify(users));
  },

  displayNotif(msg, type = 'success') {
    this._notificationSystem.addNotification({
      message: msg,
      level: type,
      position: 'tr', // top right
      autoDismiss: 4
    });
  },

  componentDidMount() {
    this.loadUser();

    // Setting edit mode from query
    const {query} = this.props.location;
    this.setState({editMode: Boolean(query._edit)});

    this._notificationSystem = this.refs.notificationSystem;
  },

  componentDidUpdate(prevProps, prevState) {
    // Run this only if user is changed
    if(this.lastLoadedUser !== this.props.params.username) {
      this.loadUser();
    }

    this._notificationSystem = this.refs.notificationSystem;
    const status = this.state.profile.status;

    // Checks related to profile edit modes
    if (prevState.profile.status !== status && status === 'saved') {
      this.displayNotif('Changes saved successfully.');
      this.setState({editMode: false});
    }
    if (prevState.profile.status !== status && status === 'err') {
      this.setState({editMode: false});

      const errors = this.state.profile.errors;
      for (let err in errors) {
        this.displayNotif(errors[err][0], 'warning');
      }
    }
  },

  loadUser() {
    const {username} = this.props.params;

    this.props.flux.actions.loadUser(username);
    this.lastLoadedUser = username;
  },

  onModeChange(ev) {
    this.setState({editMode: ev.editMode});
  },

  renderProfilePage() {
    const username = this.props.params.username,
      user = this.state.users[username],
      mode = this.state.editMode;

    return (
      <DocumentTitle title={user.name + " - Shoutit"}>
        <div>
          <Grid >
            <Column size="12" clear={true}>
              <ProfileCover
                profile={this.state.profile}
                onModeChange={this.onModeChange}
                user={user}
                editMode={mode}
              />
            </Column>
          </Grid>
          <Grid >
            <Column size="3" clear={true}>
              <ProfileLeftBoard
                user={user}
                onUserListenChange={this.onUserListenChange}
                editMode={mode}
              />
            </Column>
            <Column size="9" style={{paddingTop: "15px"}}>
              {user.is_owner ? (
                <EmbeddedShout collapsed={true}/>
              ) : null}
              <ProfileOffers {...this.state} username={username}/>

            </Column>
          </Grid>
          <NotificationSystem ref="notificationSystem"/>
        </div>
      </DocumentTitle>
    );
  },

  renderNotFound() {
    return (
      <DocumentTitle title={"User Not Found! - Shoutit"}>
        <h3>User not found!</h3>
      </DocumentTitle>
    );
  },

  renderLoading() {
    return (
      <DocumentTitle title={"[Loading...] - Shoutit"}>
        <Progress />
      </DocumentTitle>
    );
  },

  render() {
    const {username} = this.props.params,
      user = this.state.users[username];
    console.log(user);

    if (user && user.location) {
      return this.renderProfilePage();
    } else if (user === null) {
      return this.renderNotFound();
    } else {
      return this.renderLoading();
    }
  }
});
