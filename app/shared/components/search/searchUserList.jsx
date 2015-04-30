var React = require('react'),
	Col = require('react-bootstrap').Col,
	findIndex = require('lodash/array/findIndex'),
	Loader = require('../helper/loader.jsx');


var Shout = require('../home/feed/shout.jsx'),
	ListenerRow = require('../profile/listenerRow.jsx');

module.exports = React.createClass({
	displayName: "SearchUserList",

	componentDidMount: function () {
		var term = this.props.term,
			users = this.props.search.users[term];

		if (!users) {
			this.props.flux.actions.searchUsers(term);
		}
	},

	renderUsers: function (users, listening, loggedUser, flux) {
		return users.length ? users.map(function (user, i) {
			var isListening = findIndex(listening, 'username', user.username) > -1;
			return <ListenerRow key={"search-user-" + i } user={user}
								listening={isListening} loggedUser={loggedUser} flux={flux}/>
		}) : <h4>No users.</h4>;
	},

	render: function () {
		var term = this.props.term,
			users = this.props.search.users[term],
			content;

		if (users) {
			content = this.renderUsers(users, this.props.listening, this.props.loggedUser, this.props.flux);
		} else {
			content = <Loader/>;
		}

		return (
			<div className="listener-scroll ctn-offerpro" tabIndex="5000"
				 style={{outline: "none"}}>
				{content}
			</div>
		);
	}
});