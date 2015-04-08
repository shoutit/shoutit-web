var React = require('react'),
	Router = require('react-router'),
	StateMixin = Router.State,
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	moment = require('moment'),
	Col = require('react-bootstrap/Col'),
	Rating = require('./rating.jsx'),
	ShoutDetailActions = require('./shoutDetailActions.jsx'),
	TagList = require('../home/feed/shout/tags.jsx'),
	Video = require('./video.jsx');

var ShoutDetailBody = require('./shoutDetailBody.jsx');

module.exports = React.createClass({
	displayName: "ShoutDetail",
	mixins: [StateMixin, FluxMixin, StoreWatchMixin("shouts")],

	statics: {
		fetchData: function (client, session, params) {
			return client.shouts().get(session, params.shoutId);
		}
	},

	getStateFromFlux: function () {
		console.log("GetStateFromFlux", this.getParams().shoutId);
		var findRes = this.getFlux().store("shouts").findShout(this.getParams().shoutId);

		return {
			shoutId: this.getParams().shoutId,
			shout: findRes.shout,
			full: findRes.full
		};
	},

	componentDidUpdate: function () {
		this.loadFullShout();
	},

	componentDidMount: function () {
		this.loadFullShout()
	},

	loadFullShout: function () {
		if (!this.state.loadingFull && !this.state.full) {
			console.log("Not Full Shout!");
			this.setState({
				loadingFull: true
			});
			this.getFlux().actions.loadShout(this.state.shoutId);
		}
	},

	renderSubtitle: function (shout) {
		return (
			<h5>Post by&nbsp;
				<span className="poster">{shout.user.name}</span>
			&nbsp;-&nbsp;
				{moment.unix(shout.date_published).fromNow()}
			</h5>
		);
	},

	renderVideos: function (shout) {
		return shout.videos ? shout.videos.map(function (video, i) {
			var key = "shout-detail-video-" + i;
			return (<Video {...video} key={key}/>);
		}) : [];
	},

	renderImages: function (shout) {
		return shout.images ? shout.images.map(function (imageSrc, i) {
			return (
				<div key={"shout-detail-image-" + i} className="section-img">
					<img src={imageSrc}/>
				</div>
			);
		}) : [];
	},

	renderText: function (shout) {
		return <p>{shout.text}</p>;
	},

	renderTitle: function (shout) {
		return <h4>{shout.title}</h4>
	},

	renderRating: function (shout) {
		return shout.rating ?
			<Rating rating={shout.rating}/> : "";
	},

	renderActions: function () {
		return (<ShoutDetailActions/>);
	},

	renderTags: function (shout) {
		return shout.tags ?
			<TagList tags={shout.tags} /> : "";
	},

	renderBottom: function (shout) {
		return (
			<div className="btn-bottom single-shout">
			{this.renderActions()}
			{this.renderTags(shout)}
			</div>
		);
	},

	render: function () {
		var shout = this.state.shout;

		var content;

		if (shout && shout.id) {
			content = <ShoutDetailBody shout={shout} flux={this.getFlux()}/>;
		} else {
			content = (
				<Col xs={12} md={12} className="section-right">
					<h1>Shout not found!</h1>
				</Col>
			);
		}

		return (
			<Col xs={12} md={8}>
				<section className="col-xs-12 col-md-12 section-12">
					{content}
				</section>
			</Col>
		);
	}
});