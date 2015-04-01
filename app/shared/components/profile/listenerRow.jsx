var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link,
	DropdownButton = require('react-bootstrap/DropdownButton'),
	MenuItem = require('react-bootstrap/MenuItem');

module.exports = React.createClass({
	displayName: "ListenerRow",

	render: function () {
		var listener = this.props.user;

		return (
			<div class="listener-dt">
				<div class="listener-dt-img">

					<img src={listener.image}>
					</div>
					<div class="listener-dt-info">
						<h4>{listener.name}
							(
							<Link to="user" params={{username: listener.username}}>{listener.username}</Link>
							)
						</h4>
						<DropdownButton onSelect={this.onDropDownSelect} title="Listening">
							<MenuItem eventKey={"stop-" + listener.username}>Stop Listen</MenuItem>
							<MenuItem eventKey={"show-" + listener.username}>
								<Link to="user" params={{username: listener.username}}>Show Profile</Link>
							</MenuItem>
						</DropdownButton>
					</div>
				</div>
			</div>
		);
	},

	onDropDownSelect: function (key) {
		var splitted = key.split("-");
		if (splitted[0] === "stop") {
			this.flux.actions.stopListen(splitted[1]);
		} else if (splitted[0] === "show") {

		}
	}
});