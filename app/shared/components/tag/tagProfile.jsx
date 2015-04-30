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

var TagProfileImage = require('./tagProfileImage.jsx'),
	TagProfileActions = require('./tagProfileActions.jsx');

var STORE_NAME = "tags";

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin(STORE_NAME)],

	contextTypes: {
		router: React.PropTypes.func
	},

	displayName: "TagProfile",

	statics: {
		fetchData: function (client, session, params) {
			return client.tags().get(session, params.tagName);
		}
	},

	getStateFromFlux: function () {
		return this.getFlux().store(STORE_NAME).getState();
	},

	render: function () {
		var tagName = this.context.router.getCurrentParams().tagName,
			tagEntry = this.state.tags[tagName];

		if (tagEntry) {
			var linkParams = {tagName: tagName},
				tag = tagEntry.tag,
				listenerCount = tag.listeners_count;

			return (
				<DocumentTitle title={"Shoutit Tag Profile - " + tag.name}>
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
							<TagProfileImage image={tag.image} name={tag.name}/>
							<TagProfileActions tag={tag} flux={this.getFlux() } />
							<Clear/>
							<ul>
								<NavItemLink to="tagoffers" params={linkParams}>
									<Icon name="lis2"/>
									Offers
									<span/>
								</NavItemLink>
								<NavItemLink to="tagrequests" params={linkParams}>
									<Icon name="lis3"/>
									Requests
									<span/>
								</NavItemLink>
								<NavItemLink to="taglisteners" params={linkParams}>
									<Icon name="lis"/>
									Listeners
									<span>{listenerCount}</span>
								</NavItemLink>
							</ul>
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							<RouteHandler {...this.state}
								tagName={tagName}
								flux={this.getFlux()}
								/>
						</Col>
					</div>
				</DocumentTitle>
			);
		} else if (tagEntry === null) {
			return (
				<DocumentTitle title="Shoutit Profile - Not Found">
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							<h3>Tag not found.</h3>
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
		this.loadTag();
	},

	componentDidMount: function () {
		this.loadTag();
	},

	loadTag: function () {
		var tagName = this.context.router.getCurrentParams().tagName,
			tagEntry = this.state.tags[tagName];

		if (!this.state.loading && !tagEntry && tagEntry !== null) {
			this.getFlux().actions.loadTag(tagName);
		}
	}
});