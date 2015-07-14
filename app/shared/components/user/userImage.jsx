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
        return (
            <div title={this.props.name} style={{
				"height": "32px",
				"width": "32px",
				"backgroundImage": "url(" + this.getSmallUrl(this.props.image) + ")",
				"borderRadius": "16px",
				"backgroundSize": "auto 32px",
				"backgroundRepeat": "no-repeat"
			}}/>
        );
    }
});