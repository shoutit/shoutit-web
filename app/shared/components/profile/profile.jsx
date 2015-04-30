var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    Loader = require('../helper/loader.jsx');

var Col = require('react-bootstrap').Col,
    NavItemLink = require('react-router-bootstrap').NavItemLink;

var Clear = require('../helper/clear.jsx'),
    Icon = require('../helper/icon.jsx'),
    DocumentTitle = require('react-document-title');

var ProfileImage = require('./profileImage.jsx'),
    ProfileDetails = require('./profileDetails.jsx');

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("users")],

    contextTypes: {
        router: React.PropTypes.func
    },

    displayName: "Profile",

    statics: {
        fetchData: function (client, session, params) {
            return client.users().get(session, params.username);
        }
    },

    getStateFromFlux: function () {
        return this.getFlux().store("users").getState();
    },

    renderSettingsLink: function (user, linkParams) {
        return user.is_owner ? (
            <NavItemLink to="settings" params={linkParams}>
                <Icon name="set"/>
                Profile Settings
                <span></span>
            </NavItemLink>
        ) : "";
    },

    render: function () {
        var username = this.context.router.getCurrentParams().username,
            user = this.state.users[username];

        if (user) {
            var linkParams = {username: user.username},
                listenerCount = this.state.listeners[username] ?
                    this.state.listeners[username].length :
                    user.listeners_count,
                listeningCountUsers = this.state.listening[username] && this.state.listening[username].users ?
                    this.state.listening[username].users.length :
                    user.listening_count.users,
                listeningCountTags = this.state.listening[username] && this.state.listening[username].tags ?
                    this.state.listening[username].tags.length :
                    user.listening_count.tags;

            return (
                <DocumentTitle title={"Shoutit Profile - " + user.username}>
                    <div className="profile">
                        <Col xs={12} md={3} className="profile-left">
                            <ProfileImage image={user.image} name={user.name} username={user.username || " "}/>
                            <ProfileDetails location={user.location} joined={user.date_joined}/>
                            <Clear/>
                            <ul>
                                {this.renderSettingsLink(user, linkParams)}
                                <NavItemLink to="useroffers" params={linkParams}>
                                    <Icon name="lis2"/>
                                    User's Offers
                                    <span/>
                                </NavItemLink>
                                <NavItemLink to="userrequests" params={linkParams}>
                                    <Icon name="lis3"/>
                                    User's Requests
                                    <span/>
                                </NavItemLink>
                                <NavItemLink to="listeners" params={linkParams}>
                                    <Icon name="lis"/>
                                    Listeners
                                    <span>{listenerCount}</span>
                                </NavItemLink>
                                <NavItemLink to="listening" params={linkParams}>
                                    <Icon name="lis1"/>
                                    Listening
                                    <span>{listeningCountUsers + "|" + listeningCountTags }</span>
                                </NavItemLink>
                            </ul>
                        </Col>
                        <Col xs={12} md={9} className="pro-right-padding">
                            <RouteHandler {...this.state}
                                username={username}
                                flux={this.getFlux()}
                                />
                        </Col>
                    </div>
                </DocumentTitle>
            );
        } else if (user === null) {
            return (
                <DocumentTitle title="Shoutit Profile - Not Found">
                    <div className="profile">
                        <Col xs={12} md={3} className="profile-left">
                            <h3>User not found.</h3>
                        </Col>
                        <Col xs={12} md={9} className="pro-right-padding">
                        </Col>
                    </div>
                </DocumentTitle>
            );
        } else {
            return (
                <DocumentTitle title="Shoutit Profile - Loading">
                    <div className="profile">
                        <Col xs={12} md={3} className="profile-left">
                            <Loader/>
                        </Col>
                        <Col xs={12} md={9} className="pro-right-padding">
                            <Loader/>
                        </Col>
                    </div>
                </DocumentTitle>
            );
        }
    },

    componentDidUpdate: function () {
        this.loadUser();
    },

    componentDidMount: function () {
        this.loadUser();
    },

    loadUser: function () {
        var username = this.context.router.getCurrentParams().username,
            user = this.state.users[username];

        if (!this.state.loading && !user && user !== null) {
            this.getFlux().actions.loadUser(username);
        }
    }
});
