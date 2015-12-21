import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Grid, Column, Loader} from '../helper';
import ProfileOffers from './profileOffers.jsx';
import DocumentTitle from 'react-document-title';
import ProfileCover from './profileCover.jsx';
import ProfileLeftBar from './profileLeftBar.jsx';
import assign from 'lodash/object/assign';
import EmbeddedShout from '../shouting/embeddedShout.jsx';

export default React.createClass({
    displayName: "Profile",
    mixins: [new StoreWatchMixin("users")],

    // Need to move it later to profileOffers after moving this path to home route path
    statics: {
        fetchId:'useroffers',
        fetchData(client, session, params) {
            return client.users().getShouts(session, params.username, 'offer');
        }
    },

    contextTypes: {
        params: React.PropTypes.object,
        flux: React.PropTypes.object
    },

    getStateFromFlux() {
        return this.context.flux.store("users").getState();
    },

    componentDidMount() {
        this.loadUser();
        
    },

    componentDidUpdate() {
        this.loadUser();
    },

    loadUser() {
        let username = this.context.params.username,
            user = this.state.users[username],
            // condition
            shouldLoadUser = (!user || !user.location) && !this.state.loading;

        if(shouldLoadUser){
            this.context.flux.actions.loadUser(username);
        }
    },

    renderProfilePage() {
        let username = this.context.params.username,
            user = this.state.users[username];

        return (
                <DocumentTitle title={user.name + " - Shoutit"}>
                    <div>
                        <Grid >
                            <Column size="12" clear={true}>
                                <ProfileCover user={user}/>
                            </Column>
                        </Grid>
                        <Grid >
                            <Column size="3" clear={true}>
                                <ProfileLeftBar user={user} onUserListenChange={this.onUserListenChange}/>
                            </Column>
                            <Column size="9" style={{paddingTop: "15px"}}>
                                {user.is_owner? (
                                    <EmbeddedShout collapsed={true}/>
                                    ): null}
                                <ProfileOffers {...this.state} username={username} />
                                
                            </Column>
                        </Grid>
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
        return(
            <DocumentTitle title={"[Loading...] - Shoutit"}>
                <Loader />
            </DocumentTitle>
            );
    },

    render() {
        let username = this.context.params.username,
            user = this.state.users[username];

        if(user && user.location) {
            return this.renderProfilePage();
        } else if(user === null) {
            return this.renderNotFound();
        } else {
            return this.renderLoading();
        }
    }
});