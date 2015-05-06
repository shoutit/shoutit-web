var React = require('react');

var ItemProp = require('../helper/microdata/itemprop.jsx');

module.exports = React.createClass({
	displayName: "Video",

	render: function () {
		if (this.props.provider === "youtube") {
			return this.renderYTVideo();
		} else {
			return <h3 key={this.props.key}>UnknownProvider</h3>;
		}
	},

	renderYTVideo: function () {
		return (
			<ItemProp property="video">
				<iframe
					key={this.props.key} id="ytplayer" type="text/html" width="640" height="390"
					src={"https://www.youtube.com/embed/" + this.props.id_on_provider}
					frameBorder="0"/>
			</ItemProp>
		);
	}
});