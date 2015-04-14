var React = require('react'),
	classnames = require('classnames'),
	Col = require('react-bootstrap/Col'),
	Image = require('../../../helper/image.jsx');

	module.exports = React.createClass({
	displayName: "ShoutHeader",

	getDefaultProps: function () {
		return {
			logoRight: false
		}
	},

	render: function () {
		var isSmall = (this.props.listType === "small");

		var classes = {
			"section-left": isSmall
		};

		var subimage = !isSmall ?
			(<p className="show-day">{this.props.agoText}</p>) :
			"";


		return (
			<Col xs={12} md={2} mdPush={this.props.logoRight ? 10 : 0} className={classnames(classes)}>
				<Image className="img-lg" infix="user" src={this.props.logoSrc}/>
				{subimage}
			</Col>
		);
	}
});