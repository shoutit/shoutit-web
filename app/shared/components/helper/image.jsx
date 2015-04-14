var React = require('react'),
	url = require('url'),
	joinClasses = require('react/lib/joinClasses');

module.exports = React.createClass({
	displayName: "Image",

	getInitialState: function () {
		return {
			loaded: false,
			src: null
		};
	},

	getDefaultProps: function () {
		return {
			size: "small",
			ytSize: "mq",
			infix: "shout"
		}
	},

	onImageLoad: function (url) {
		if (this.isMounted()) {
			this.setState({
				loaded: this.props.src,
				src: url
			});
		}
	},

	onLoadError: function (img) {
		return function () {
			if (this.isMounted()) {
				img.onerror = null;
				this.setState({
					loaded: this.props.src,
					src: this.props.src
				});
			}
		}.bind(this);
	},


	render: function () {
		var className = this.props.className;
		var imageClasses = 'image';
		if (this.state.loaded) {
			imageClasses = joinClasses(imageClasses, 'image-loaded');
		}

		return (
			<img ref="image" src={this.state.src} className={joinClasses(className, imageClasses)}/>
		);
	},

	componentDidMount: function () {
		this.loadImage();
	},

	componentDidUpdate: function() {
		if(this.props.src !== this.state.loaded) {
			this.loadImage();
		}
	},

	loadImage: function() {
		var url = this.props.src;
		if (url.indexOf("shoutit-"+ this.props.infix +"-image-original") > -1) {
			url = url.replace("-original", "")
				.replace('.jpg', '_' + this.props.size + '.jpg')
				.replace('.jpeg', '_' + this.props.size + '.jpeg');
		} else if (url.indexOf("hqdefault") > -1) {
			url = url.replace("hqdefault", this.props.ytSize + "default");
		}

		var img = new window.Image();
		img.onload = this.onImageLoad(url);
		img.onerror = this.onLoadError(img);
		img.src = url;
	}
});