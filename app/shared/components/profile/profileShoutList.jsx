var React = require('react'),
	Col = require('react-bootstrap/Col');

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
			shouts = this.props.shouts[username][this.props.type + 's'];

		if (!shouts) {
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
			shouts = this.props.shouts[username][this.props.type + 's'],
			content, stat;

		if (shouts) {
			content = this.renderProfileShouts(shouts);
			stat = <span>{' (' + shouts.length + ')'}</span>;
		} else {
			var Loader = require('halogen').PulseLoader;
			content = <Loader color="#bfdd6d"/>;
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