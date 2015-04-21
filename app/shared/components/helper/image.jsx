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

	componentDidUpdate: function () {
		if (this.state.src !== this.getSizedUrl()) {
			this.setState({
				src: this.getSizedUrl(),
				loaded: false
			}, function () {
				this.hookImageLoad()
			}.bind(this));
		}
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
			this.setState({loaded: true});
		}
	},

	onLoadError: function () {
		this.setState({
			src: this.props.src
		});
	},

	componentDidMount: function () {
		this.hookImageLoad();
	},

	render: function () {
		var className = this.props.className;
		var imageClasses = 'image';
		if (typeof window === 'undefined' || this.state.loaded) {
			imageClasses = joinClasses(imageClasses, 'image-loaded');
		}

		return (
			<img ref="image"
				 src={this.state.src}
				 title={this.props.title}
				 className={joinClasses(className, imageClasses)}
				/>
		);
	},

	getSizedUrl: function (src) {
		var url = src || this.props.src;
		if (url.indexOf("shoutit-" + this.props.infix + "-image-original") > -1) {
			url = url.replace("-original", "")
				.replace('.jpg', '_' + this.props.size + '.jpg')
				.replace('.jpeg', '_' + this.props.size + '.jpeg');
		} else if (url.indexOf("hqdefault") > -1) {
			url = url.replace("hqdefault", this.props.ytSize + "default");
		}
		return url;
	},

	hookImageLoad: function () {
		var imgTag = this.refs.image.getDOMNode();

		var imgSrc = imgTag.getAttribute('src');

		var img = new window.Image();
		img.onload = this.onImageLoad;
		img.onerror = this.onLoadError;
		img.src = imgSrc;
	}
});