var React = require('react'),
	Router = require('react-router'),
	moment = require('moment'),
	Col = require('react-bootstrap').Col,
	Rating = require('./rating.jsx'),
	ShoutDetailActions = require('./shoutDetailActions.jsx'),
	TagList = require('../home/feed/shout/tags.jsx'),
	Video = require('./video.jsx');

var Image = require('../helper/image.jsx'),
	ItemProp = require('../helper/microdata/itemprop.jsx'),
	ItemScope = require('../helper/microdata/itemscope.jsx');


var types = {
	offer: "Offer",
	request: "Request"
};


module.exports = React.createClass({
	displayName: "ShoutDetailBody",

	renderSubtitle: function (shout) {
		var link = shout.user.is_activated ?
			<Router.Link to="user" params={{username: encodeURIComponent(shout.user.username)}}>
				{shout.user.name}
			</Router.Link> : shout.user.name;

		return (
			<h5>{types[shout.type]} by&nbsp;
				<span className="poster">
                    {link}
				</span>
				&nbsp;-&nbsp;
				{moment.unix(shout.date_published).fromNow()}
			</h5>
		);
	},

	renderVideos: function (shout) {
		return shout.videos ?
			<p>
				{shout.videos.map(function (video, i) {
					var key = "shout-detail-video-" + i;
					return (<Video {...video} key={key}/>);
				})}
			</p>
			: [];
	}
	,

	renderImages: function (shout) {
		return shout.images ? shout.images.map(function (imageSrc, i) {
			return (
				<div key={"shout-detail-image-" + i} className="section-img">
					<ItemProp property="image">
						<Image size="large" src={imageSrc}/>
					</ItemProp>
				</div>
			);
		}) : [];
	}
	,

	renderText: function (shout) {
		return (
			<ItemProp property="description">
				<p>{shout.text}</p>
			</ItemProp>
		);
	}
	,

	renderTitle: function (shout) {
		return (
			<ItemProp property="name">
				<h4>{shout.title}</h4>
			</ItemProp>
		);
	}
	,

	renderRating: function (shout) {
		return shout.rating ?
			<Rating rating={shout.rating}/> : "";
	}
	,

	renderActions: function () {
		return (<ShoutDetailActions/>);
	}
	,

	renderTags: function (shout) {
		return shout.tags ?
			<TagList tags={shout.tags}/> : "";
	}
	,

	renderBottom: function (shout) {
		return (
			<div className="btn-bottom single-shout">
				{this.renderActions()}
				{this.renderTags(shout)}
			</div>
		);
	}
	,

	renderOffer: function (shout) {
		if (shout.type === "offer" && shout.price && shout.currency) {
			return (
				<ItemProp property="offers">
					<div className="price-offer">
						<div className="price">
							<ItemProp property="price">
								<span>{shout.price}</span>
							</ItemProp>
							&nbsp;
							<ItemProp property="priceCurrency" content={shout.origCurrency}>
								<span>{shout.currency}</span>
							</ItemProp>
						</div>
					</div>
				</ItemProp>
			);
		}
	}
	,

	render: function () {
		var shout = this.props.shout;

		return (
			<ItemScope type="Product">
				<Col {...this.props} xs={12} md={12} className="section-right">
					{this.renderTitle(shout)}
					{this.renderSubtitle(shout)}
					{this.renderText(shout)}
					{this.renderVideos(shout)}
					{this.renderImages(shout)}
					{this.renderOffer(shout)}
					{this.renderRating(shout)}
					{this.renderBottom(shout)}
				</Col>
			</ItemScope>
		);
	}
})
;