/** @jsx React.DOM */

var React = require('react'),
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
		return (
			<Col xs={12} md={10} mdPull={this.props.logoRight ? 2 : 0} className="section-right">
				<Mui right={this.props.logoRight}/>
				<h4>LG G3 Smartphone</h4>
				<p>Lorem ipsum dolor sit amet, his interesset concludaturque te, id pro timeam efficiendi scripse
					rit, tempor eleifend rationibus vel eu. Alia ludus eruditi id has, ei mei aliquip dolores. Odio aliq
					ud pri at, cum impetus eruditi singulis ad, detraxit tempori</p>
				<div className="section-right-img">
					<img src="img/dummies/lg1.png"/>
					<img src="img/dummies/lg2.png"/>
					<p>Lorem ipsum dolor sit amet, his interesset concludaturque te, id pro timeam efficiendi scripse
						rit, tempor eleifend rationibus vel eu. Alia ludus eruditi id has, ei mei aliquip dolores. Odio aliq
						ud pri at, cum impetus eruditi singulis ad, detraxit tempori</p>
				</div>
				<div className="btn-bottom">
					<Actions/>
					<TagList tags={["LG", "Smartphone"]}/>
				</div>
			</Col>
		);
	}
});