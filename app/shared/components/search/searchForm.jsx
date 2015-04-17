var React = require('react'),
	Col = require('react-bootstrap/Col');

module.exports = React.createClass({
	displayName: "SearchForm",

	render: function () {
		return (
			<Col xs={12} md={3} className="profile-left">
				<h3>Search Shoutit</h3>
				<h5>{this.props.tags.join('-')}</h5>
				<h5>{this.props.type}</h5>
			</Col>
		);
	}
});