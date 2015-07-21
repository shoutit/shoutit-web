import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {DropdownButton, MenuItem} from 'react-bootstrap';

export default React.createClass({
	mixins: [new FluxMixin(React), new StoreWatchMixin('users')],
	displayName: "TagProfileActions",

	getStateFromFlux() {
		return this.getFlux().store('users').getState();
	},

	render() {
		let tag = this.props.tag;
		let actions;

		if (this.state.user) {
			let isListening = tag.is_listening;

			let title = isListening ? "Listening" : "Not Listening";
			let firstOption = isListening ?
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

	onDropDownSelect(key) {
		let splitted = key.split("-");
		if (splitted[0] === "stop") {
			this.props.flux.actions.stopListenTag(splitted[1]);
		} else if (splitted[0] === "start") {
			this.props.flux.actions.listenTag(splitted[1]);
		}
	}
});
