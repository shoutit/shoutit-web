var React = require('react'),
	Col = require('react-bootstrap').Col,
	Loader = require('../helper/loader.jsx');


var Clear = require('../helper/clear.jsx'),
	Image = require('../helper/image.jsx'),
	Shout = require('../home/feed/shout.jsx');

var map = {
	request: "Requests",
	offer: "Offers"
};

module.exports = React.createClass({
	displayName: "ProfileShoutList",

	componentDidMount: function () {
		var username = this.props.username,
			userShouts = this.props.shouts[username] || {},
			shouts = userShouts[this.props.type + 's'];

		if (!userShouts || !shouts) {
			this.props.flux.actions.loadUserShouts(this.props.username, this.props.type);
		}
	},

	renderProfileShouts: function (shouts) {
		return shouts.length ? shouts.map(function (shout, i) {
			return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
		}) : <h4>No shouts.</h4>;
	},

	render: function () {
		var username = this.props.username,
			user = this.props.users[username],
			userShouts = this.props.shouts[username] || {},
			shouts = userShouts[this.props.type + 's'],
			content, stat;

		if (userShouts && shouts) {
			content = this.renderProfileShouts(shouts);
			stat = <span>{' (' + shouts.length + ')'}</span>;
		} else {
			content = <Loader/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>
							{user.first_name + "'s" + map[this.props.type] + ":"}
							{stat}
						</p>
					</div>
					<Clear />

					<div className="listener-scroll ctn-offerpro" tabIndex="5000"
						 style={{outline: "none"}}>
						{content}
					</div>
				</div>
			</Col>
		);
	}
});