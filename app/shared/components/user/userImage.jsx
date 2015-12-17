import React from 'react';

export default React.createClass({
	displayName: "UserImage",

	proprTypes: {
		height: React.PropTypes.string,
		width: React.PropTypes.string,
		size: React.PropTypes.string,
		type: React.PropTypes.string, // Choice (circle, rounded, rounded2x, square)
		image: React.PropTypes.string
	},

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
			"height": this.props.height ? this.props.height + "px":
					this.props.size? this.props.size + "px": "32px",
			"width": this.props.width ? this.props.width + "px":
					this.props.size? this.props.size + "px": "32px",
			"backgroundImage": "url(" + this.getSmallUrl(this.props.image) + ")",
			"backgroundSize": "cover",
			"backgroundRepeat": "no-repeat"
		};

		if(this.props.type === 'circle') {
			style.borderRadius = this.props.height? (this.props.height / 2) + "px" : "16px";
		} else if(this.props.type === 'rounded') {
			style.borderRadius = "5px";
		} else if(this.props.type === 'rounded2x') {
			style.borderRadius = "10px";
		} if(this.props.type === 'square') {
			style.borderRadius = "0";
		}


		if (this.props.image.indexOf("default_") > -1) {
			style.backgroundPosition = "0 -15px";
		}


		return (
			<div className={this.props.className + " user-image"} title={this.props.name} style={style}/>
		);
	}
});
