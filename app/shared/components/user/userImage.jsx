var React = require('react');

module.exports = React.createClass({
	displayName: "UserImage",

	getSmallUrl: function (imageUrl) {
		if (imageUrl.indexOf("shoutit-user-image-original") > -1) {
			return imageUrl.replace("-original", "")
				.replace('.jpg', '_small.jpg')
				.replace('.jpeg', '_small.jpeg');
		} else {
			return imageUrl;
		}
	},

	render: function () {
		var style = {
			"height": this.props.height ? this.props.height + "px" : "32px",
			"width": this.props.width ? this.props.width + "px" : "32px",
			"backgroundImage": "url(" + this.getSmallUrl(this.props.image) + ")",
			"borderRadius": this.props.height ? (this.props.height / 2) + "px" : "16px",
			"backgroundSize": (this.props.height ? this.props.height + "px" : "32px") + " auto",
			"backgroundRepeat": "no-repeat"
		};

		if (this.props.image.indexOf("default_") > -1) {
			style.backgroundPosition = "0 -15px";
		}


		return (
			<div className="userImage center-block" title={this.props.name} style={style}/>
		);
	}
});