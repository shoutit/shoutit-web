var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	DropdownButton = require('react-bootstrap').DropdownButton,
	MenuItem = require('react-bootstrap').MenuItem;

var Icon = require('../helper/icon.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin('users')],
	displayName: "TagProfileActions",

	getStateFromFlux: function () {
		return this.getFlux().store('users').getState()
	},

	render: function () {
		var tag = this.props.tag;
		var actions;

		if (this.state.user) {
			var isListening = tag.is_listening;

			var title = isListening ? "Listening" : "Not Listening";
			var firstOption = isListening ?
				<MenuItem eventKey={"stop-" + tag.name}>Stop Listening</MenuItem> :
				<MenuItem eventKey={"start-" + tag.name}>Start Listening</MenuItem>;

			actions =
				<DropdownButton onSelect={this.onDropDownSelect} title={title}>
					{firstOption}
				</DropdownButton>;
		}


		return (
			<div className="profile-details">
				<div className="birth">
					{actions}
				</div>
			</div>
		);
	},

	onDropDownSelect: function (key) {
		var splitted = key.split("-");
		if (splitted[0] === "stop") {
			this.props.flux.actions.stopListenTag(splitted[1]);
		} else if (splitted[0] === "start") {
			this.props.flux.actions.listenTag(splitted[1]);
		}
	}
});