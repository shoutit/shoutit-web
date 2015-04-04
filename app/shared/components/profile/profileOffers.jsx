var React = require('react'),
	Col = require('react-bootstrap/Col');

var Clear = require('../helper/clear.jsx');

module.exports = React.createClass({
	displayName: "ProfileOffers",

	componentDidMount: function() {
		this.props.flux.actions.loadUserShouts();
	},

	render: function () {
		console.log(this.props.shouts);

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>{this.props.user.first_name}'s Offers</p>
					</div>
					<Clear />
				</div>
			</Col>
		);
	}
});