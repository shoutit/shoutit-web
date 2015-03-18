var React = require('react');

module.exports = React.createClass({
	displayName: "Video",

	render: function () {
		if (this.props.provider === "youtube") {
			return this.renderYTVideo();
		} else {
			return <h3 key={this.props.key}>UnknownProvider</h3>;
		}
	},

	renderYTVideo: function() {
		return (
			<iframe
				key={this.props.key} id="ytplayer" type="text/html" width="640" height="390"
				src={"http://www.youtube.com/embed/" + this.props.id_on_provider}
				frameBorder="0"/>
		);
	}
});