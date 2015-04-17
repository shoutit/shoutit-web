var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SearchUserList = require('./searchUserList.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("users")],
	displayName: "SearchUsers",

	getStateFromFlux: function () {
		return this.getFlux().store("users").getState();
	},

	statics: {
		fetchData: function (client, session, params) {
			return client.users().search(session, {
				search: params.term
			});
		}
	},

	render: function () {
		var logged = this.state.user,
			loggedUser = logged ? this.state.users[logged] : null,
			listening = logged ? this.state.listening[logged] : null;

		return <SearchUserList{...this.props}
			listening={listening}
			loggedUser={loggedUser}
			/>;
	}
});