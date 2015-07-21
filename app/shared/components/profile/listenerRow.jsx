import React from 'react';
import {Link} from 'react-router';
import {DropdownButton, MenuItem} from 'react-bootstrap';

import {Image} from '../helper';

export default React.createClass({
	displayName: "ListenerRow",

	render() {
		let listener = this.props.user;

		let title = this.props.listening ? "Listening" : "Not Listening";
		let firstOption = this.props.listening ?
			<MenuItem eventKey={"stop-" + listener.username}>Stop Listening</MenuItem> :
			<MenuItem eventKey={"start-" + listener.username}>Start Listening</MenuItem>;

		let actions = this.props.loggedUser ?
			<DropdownButton onSelect={this.onDropDownSelect} title={title}>
				{firstOption}
				<MenuItem eventKey={"show-" + listener.username}>
					<Link to="user" params={{username: encodeURIComponent(listener.username)}}>Show Profile</Link>
				</MenuItem>
			</DropdownButton> : null;

		return (
			<div className="listener-dt">
				<div className="listener-dt-img">
					<Image infix="user" size="small" src={listener.image}/>
				</div>
				<div className="listener-dt-info">
					<h4>{listener.name}
						(
						<Link to="user"
							  params={{username: encodeURIComponent(listener.username)}}>{listener.username}</Link>
						)
					</h4>
					{actions}
				</div>
			</div>
		);
	},

	onDropDownSelect(key) {
		let splitted = key.split("-");
		if (splitted[0] === "stop") {
			this.props.flux.actions.stopListen(splitted[1]);
		} else if (splitted[0] === "start") {
			this.props.flux.actions.listen(splitted[1]);
		}
	}
});
