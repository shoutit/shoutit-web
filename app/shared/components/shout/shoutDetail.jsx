var React = require('react'),
	Router = require('react-router'),
	StateMixin = Router.State,
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	moment = require('moment'),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	Col = require('react-bootstrap/Col'),
	Rating = require('./rating.jsx'),
	ShoutDetailActions = require('./shoutDetailActions.jsx'),
	TagList = require('../home/feed/shout/tags.jsx'),
	Video = require('./video.jsx');

module.exports = React.createClass({
	displayName: "ShoutDetail",
	mixins: [StateMixin, FluxMixin, StoreWatchMixin("shouts")],

	statics: {
		fetchData: function (client, session, params) {
			return client.shouts().get(session, params.shoutId);
		}
	},

	getStateFromFlux: function () {
		return this.getFlux().store("shouts").findShout(this.getParams().shoutId);
	},

	renderSubtitle: function () {
		return (
			<h5>Post by&nbsp;
				<span className="poster">{this.state.user.name}</span>
			&nbsp;-&nbsp;
				{moment.unix(this.state.date_published).fromNow()}
			</h5>
		);
	},

	renderVideos: function () {
		return this.state.videos ? this.state.videos.map(function (video, i) {
			var key = "shout-detail-video-" + i;
			return (<Video {...video} key={key}/>);
		}) : [];
	},

	renderImages: function () {
		return this.state.images ? this.state.images.map(function (imageSrc, i) {
			return (
				<div key={"shout-detail-image-" + i} className="section-img">
					<img src={imageSrc}/>
				</div>
			);
		}) : [];
	},

	renderText: function () {
		return <p>{this.state.text}</p>;
	},

	renderTitle: function () {
		return <h4>{this.state.title}</h4>
	},

	renderRating: function () {
		return this.state.rating ?
			<Rating rating={this.state.rating}/> : "";
	},

	renderActions: function () {
		return (<ShoutDetailActions/>);
	},

	renderTags: function () {
		return this.state.tags ?
			<TagList tags={this.state.tags} /> : "";
	},

	renderBottom: function () {
		return (
			<div className="btn-bottom single-shout">
			{this.renderActions()}
			{this.renderTags()}
			</div>
		);
	},

	render: function () {
		var content;

		if (this.state.id) {
			content = (
				<Col xs={12} md={12} className="section-right">
					{this.renderTitle()}
					{this.renderSubtitle()}
					{this.renderText()}
					{this.renderVideos()}
					{this.renderImages()}
					{this.renderRating()}
					{this.renderBottom()}
				</Col>);

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