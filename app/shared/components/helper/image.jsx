var React = require('react'),
	url = require('url'),
	joinClasses = require('react/lib/joinClasses');

module.exports = React.createClass({
	displayName: "Image",

	getInitialState: function () {
		return {
			loaded: false,
			src: this.getSizedUrl()
		};
	},

	getDefaultProps: function () {
		return {
			size: "small",
			ytSize: "mq",
			infix: "shout"
		}
	},

	onImageLoad: function () {
		if (this.isMounted()) {
			this.setState({
				loaded: true
			});
		}
	},

	onLoadError: function () {
		if (this.isMounted()) {
			this.setState({
				src: this.props.src
			});
		}
	},


	render: function () {
		var className = this.props.className;
		var imageClasses = 'image';
		if (this.state.loaded) {
			imageClasses = joinClasses(imageClasses, 'image-loaded');
		}

		return (
			<img ref="image"
				 src={this.state.src}
				 className={joinClasses(className, imageClasses)}
				 onLoad={this.onImageLoad}
				 onError={this.onLoadError}
				/>
		);
	},

	getSizedUrl: function () {
		var url = this.props.src;
		if (url.indexOf("shoutit-" + this.props.infix + "-image-original") > -1) {
			url = url.replace("-original", "")
				.replace('.jpg', '_' + this.props.size + '.jpg')
				.replace('.jpeg', '_' + this.props.size + '.jpeg');
		} else if (url.indexOf("hqdefault") > -1) {
			url = url.replace("hqdefault", this.props.ytSize + "default");
		}
		return url;
	}
});