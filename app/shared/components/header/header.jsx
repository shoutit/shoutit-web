

var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	TopBar = require('./topBar.jsx'),
	MainMenu = require('./mainMenu.jsx');

module.exports = React.createClass({
	displayName: "Header",
	mixins: [FluxMixin, StoreWatchMixin("users")],

	getStateFromFlux: function () {
		return this.getFlux().store("users").getState();
	},

	render: function () {
		return (
			<header>
				<TopBar {...this.state} onLogoutClicked={this.onLogoutClicked}/>
				<MainMenu {...this.state} />
			</header>
		);
	},

	onLogoutClicked: function () {
		this.getFlux().actions.logout();
	}
});