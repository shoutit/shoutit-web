import React from 'react';
import findIndex from 'lodash/array/findIndex';
import {Loader} from '../helper';

import ListenerRow from '../profile/listenerRow.jsx';

export default React.createClass({
	displayName: "SearchUserList",

	componentDidMount() {
		let term = this.props.term,
			users = this.props.search.users[term];

		if (!users) {
			this.props.flux.actions.searchUsers(term);
		}
	},

	renderUsers(users, listening, loggedUser, flux) {
		return users.length ? users.map(function (user, i) {
			let isListening = findIndex(listening, 'username', user.username) > -1;
			return (
				<ListenerRow key={"search-user-" + i } user={user}
							 listening={isListening} loggedUser={loggedUser} flux={flux}/>
			);
		}) : <h4>No users.</h4>;
	},

	render() {
		let term = this.props.term,
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
