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
		console.log("Loaded", this.state.src);
		if (this.isMounted()) {
			this.setState({loaded: true});
		}
	},

	onLoadError: function () {
		console.log("Error Loading", this.state.src);
		this.setState({
			src: this.props.src
		});
	},

	componentDidMount: function() {
		var imgTag = this.refs.image.getDOMNode();

		var imgSrc = imgTag.getAttribute('src');

		var img = new window.Image();
		img.onload = this.onImageLoad;
		img.onerror = this.onLoadError;
		img.src = imgSrc;
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