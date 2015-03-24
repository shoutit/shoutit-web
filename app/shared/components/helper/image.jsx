var React = require('react'),
	url = require('url'),
	joinClasses = require('react/lib/joinClasses');

module.exports = React.createClass({
	displayName: "Image",

	getInitialState: function () {
		return {
			loaded: false
		};
	},

	getDefaultProps: function () {
		return {
			size: "medium"
		}
	},

	onImageLoad: function () {
		if (this.isMounted()) {
			this.setState({loaded: true});
		}
	},

	onLoadError: function (img) {
		var This = this;
		return function () {
			if (This.isMounted()) {
				img.onerror = null;
				img.src = This.props.src;
				This.setState({
					loaded: true
				});
			}
		}
	},


	render: function () {
		var className = this.props.className;
		var imageClasses = 'image';
		if (this.state.loaded) {
			imageClasses = joinClasses(imageClasses, 'image-loaded');
		}

		return (
			<img ref="image" src={this.props.src} className={joinClasses(className, imageClasses)} />
		);
	},

	componentDidMount: function () {
		var imgTag = this.refs.image.getDOMNode();
		var img = new window.Image();
		img.onload = this.onImageLoad;
		img.onerror = this.onLoadError(img);
		var url = imgTag.getAttribute('src');
		if (url.indexOf("shoutit-shout-image-original") > -1) {
			url = this.props.src.replace("-original", "")
				.replace('.jpg', '_medium.jpg')
				.replace('.jpeg', '_medium.jpeg');
		}
		img.src = url;
	}
});