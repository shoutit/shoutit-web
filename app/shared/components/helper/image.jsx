import React from 'react';
import classnames from 'classnames';

export default React.createClass({
    displayName: "Image",

    getInitialState() {
        return {
            isInitialLoad: true,
            loaded: false,
            src: this.getSizedUrl()
        };
    },

    componentDidUpdate() {
        if (this.state.src !== this.getSizedUrl()) {
            this.setState({
                src: this.getSizedUrl(),
                loaded: false
            }, function () {
                this.hookImageLoad();
            }.bind(this));
        }
    },

    getDefaultProps() {
        return {
            size: "small",
            ytSize: "mq",
            infix: "shout"
        };
    },

    onImageLoad() {
        if (this.isMounted()) {
            this.setState({loaded: true});
        }
    },

    onLoadError() {
        this.setState({
            src: this.props.src
        });
    },

    componentDidMount() {
        this.setState({
            isInitialLoad: false
        });
        this.hookImageLoad();
    },

    render() {
        let className = this.props.className;
        let imageClasses = 'image';
        if (this.state.isInitialLoad || this.state.loaded) {
            imageClasses = classnames(imageClasses, 'image-loaded');
        }

        return (
            <img {...this.props}
                ref="image"
                src={this.state.src}
                title={this.props.title}
                className={classnames(className, imageClasses)}
                />
        );
    },

    getSizedUrl(src) {
        let sizedUrl = src || this.props.src;

        sizedUrl = sizedUrl.replace("http://", "https://");

        if (sizedUrl.indexOf(this.props.infix + "-image.static.shoutit") > -1) {
            sizedUrl = sizedUrl
                .replace(".jpg", "_" + this.props.size + ".jpg")
                .replace(".jpeg", "_" + this.props.size + ".jpeg");
        } else if (sizedUrl.indexOf("hqdefault") > -1) {
            sizedUrl = sizedUrl.replace("hqdefault", this.props.ytSize + "default");
        }
        return sizedUrl;
    },

    hookImageLoad() {
        let imgTag = this.refs.image.getDOMNode();

        let imgSrc = imgTag.getAttribute('src');

        let img = new window.Image();
        img.onload = this.onImageLoad;
        img.onerror = this.onLoadError;
        img.src = imgSrc;
    }
});
