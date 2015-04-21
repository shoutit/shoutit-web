var React = require('react'),
	Router = require('react-router'),
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
		//console.log(this.props);

		var isSmall = (this.props.listType === "small");

		var classes = {
			"section-left": isSmall
		};

		var subimage = !isSmall ?
			(<p className="show-day">{this.props.agoText}</p>) :
			"";


		return (
			<Col xs={12} md={2} mdPush={this.props.logoRight ? 10 : 0} className={classnames(classes)}>
				<Router.Link to="user" params={{username: this.props.creator.username}}>
					<Image className="img-lg" infix="user" src={this.props.logoSrc} title={this.props.creator.name}/>
					{subimage}
				</Router.Link>
			</Col>
		);
	}
});