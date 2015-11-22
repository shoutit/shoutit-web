import React from 'react';

export default React.createClass({
	displayName: "UserImage",

	getDefaultProps() {
		return {
			type: "circle"
		}
	},

	getSmallUrl(imageUrl) {
		let sizedUrl = imageUrl;

		sizedUrl = sizedUrl.replace("http://", "https://");

		if (sizedUrl.indexOf("user-image.static.shoutit") > -1) {
			sizedUrl = sizedUrl
				.replace(".jpg", "_small.jpg")
				.replace(".jpeg", "_small.jpeg");
		} else if (sizedUrl.indexOf("hqdefault") > -1) {
			sizedUrl = sizedUrl.replace("hqdefault", this.props.ytSize + "default");
		}
		return sizedUrl;
	},

	render() {
		let style = {
			"height": this.props.height ? this.props.height + "px" : "32px",
			"width": this.props.width ? this.props.width + "px" : "32px",
			"backgroundImage": "url(" + this.getSmallUrl(this.props.image) + ")",
			"backgroundSize": (this.props.height ? this.props.height + "px" : "32px") + " auto",
			"backgroundRepeat": "no-repeat"
		};

		if(this.props.type === 'circle') {
			style.borderRadius = this.props.height? (this.props.height / 2) + "px" : "16px";
		}

		if (this.props.image.indexOf("default_") > -1) {
			style.backgroundPosition = "0 -15px";
		}


		return (
			<div className="user-image" title={this.props.name} style={style}/>
		);
	}
});
