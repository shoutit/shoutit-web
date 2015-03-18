var React = require('react'),
	Link = require('react-router').Link,
	Col = require('react-bootstrap/Col'),
	TagList = require('./tags.jsx'),
	Actions = require('./actions.jsx'),
	Mui = require('./mui.jsx');

module.exports = React.createClass({
	displayName: "ShoutBody",

	getDefaultProps: function () {
		return {
			logoRight: false
		}
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
					<img src={shout.thumbnail} />
				</div> : ""}
				<p>{shout.text}</p>
				<div className="btn-bottom">
					<Actions/>
					<TagList tags={shout.tags}/>
				</div>
			</Col>
		);
	}
});