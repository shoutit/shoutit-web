var React = require('react'),
	moment = require('moment'),
	Col = require('react-bootstrap/Col'),
	Rating = require('./rating.jsx'),
	ShoutDetailActions = require('./shoutDetailActions.jsx'),
	TagList = require('../home/feed/shout/tags.jsx'),
	Video = require('./video.jsx');

module.exports = React.createClass({
	displayName: "ShoutDetailBody",

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
		var shout = this.props.shout;

		return (
			<Col xs={12} md={12} className="section-right">
					{this.renderTitle(shout)}
					{this.renderSubtitle(shout)}
					{this.renderText(shout)}
					{this.renderVideos(shout)}
					{this.renderImages(shout)}
					{this.renderRating(shout)}
					{this.renderBottom(shout)}
				</Col>
		);
	}
});