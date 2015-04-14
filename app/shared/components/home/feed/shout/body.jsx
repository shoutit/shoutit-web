var React = require('react'),
	Link = require('react-router').Link,
	Col = require('react-bootstrap/Col'),
	TagList = require('./tags.jsx'),
	Actions = require('./actions.jsx'),
	Mui = require('./../../../helper/mui.jsx'),
	Image = require('../../../helper/image.jsx'),
	moment = require('moment');

module.exports = React.createClass({
	displayName: "ShoutBody",

	getDefaultProps: function () {
		return {
			logoRight: false
		}
	},

	renderBottom: function (shout) {
		return this.props.listType === "small" ?
			(
				<div className="ctn-offerpro-bottom">
					<ul>
						<li className="postby">
							{"Posted by : " + shout.user.name + ", " +
							moment.unix(shout.date_published).format('L')}
						</li>
					</ul>
				</div>
			) :
			(
				<div className="btn-bottom">
					<Actions/>
					<TagList tags={shout.tags}/>
				</div>
			);
	},

	render: function () {
		var shout = this.props.shout;

		return (
			<Col xs={12} md={10} mdPull={this.props.logoRight ? 2 : 0} className="section-right">
				<Mui right={this.props.logoRight}/>
				<h4>
					<Link to="shout" params={{shoutId: shout.id}}>
						{shout.title}
					</Link>
				</h4>
				{shout.thumbnail ? <div className="section-right-img">
					<Image src={shout.thumbnail}/>
				</div> : ""}
				<p>{shout.text}</p>
				{this.renderBottom(shout)}
			</Col>
		);
	}
});