import React from "react";
import {Grid, Column, Progress} from "../helper";
import ProfileOffers from "./profileOffers.jsx";
import DocumentTitle from "react-document-title";
import ProfileCover from "./profileCover.jsx";
import assign from "lodash/object/assign";
import EmbeddedShout from "../shouting/embeddedShout.jsx";
import NotificationSystem from "react-notification-system";
import ProfilePictureCard from './cards/profilePictureCard.jsx';
import ProfileBioCard from './cards/profileBioCard.jsx';
import ProfileButtonsCard from './cards/profileButtonsCard.jsx';
import ProfilePagesCard from './cards/profilePagesCard.jsx';
import ProfileEditorCard from './cards/profileEditorCard.jsx';

export default React.createClass({
  displayName: "Profile",

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
    };
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

  componentDidUpdate(prevProps) {
    // Run this only if user is changed
    if(this.lastLoadedUser !== this.props.params.username) {
      this.loadUser();
    }

    this._notificationSystem = this.refs.notificationSystem;
    const status = this.props.profile.status;

    // Checks related to profile edit modes
    if (prevProps.profile.status !== status && status === 'saved') {
      this.displayNotif('Changes saved successfully.');
      this.setState({editMode: false});
    }
    if (prevProps.profile.status !== status && status === 'err') {
      this.setState({editMode: false});

      const errors = this.props.profile.errors;
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
      user = this.props.users[username],
      mode = this.state.editMode;

    return (
      <DocumentTitle title={user.name + " - Shoutit"}>
        <div>
          <Grid >
            <Column size="12" clear={true}>
              <ProfileCover
                profile={this.props.profile}
                onModeChange={this.onModeChange}
                user={user}
                editMode={mode}
              />
            </Column>
          </Grid>
          <Grid >
            <Column size="3" clear={true}>

              <Grid fluid={true}>
                <ProfilePictureCard editMode={mode} user={user} />
                {editMode?
                  <ProfileEditorCard user={user} />
                  :
                  <Grid fluid={true}>
                    <ProfileButtonsCard user={user} />
                    <ProfileBioCard user={user} />
                    {/*<ProfilePagesCard user={user} />*/}
                  </Grid>
                }
              </Grid>

            </Column>
            <Column size="9" style={{paddingTop: "15px"}}>
              {user.is_owner ? (
                <EmbeddedShout collapsed={true}/>
              ) : null}
              <ProfileOffers {...this.props} username={username}/>

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
      user = this.props.users[username];

    if(user && user.location) {
      if(user.loading) {
        return this.renderLoading();
      } else {
        return this.renderProfilePage();
      }
    } else {
      if(user === null) {
        return this.renderNotFound();
      } else {
        return this.renderLoading();
      }
    }
  }
});
