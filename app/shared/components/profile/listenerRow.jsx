var React = require('react'),
	Router = require('react-router'),
	Link = Router.Link,
	DropdownButton = require('react-bootstrap').DropdownButton,
	MenuItem = require('react-bootstrap').MenuItem;

var Image = require('../helper/image.jsx');

module.exports = React.createClass({
	displayName: "ListenerRow",

	render: function () {
		var listener = this.props.user;

		var title = this.props.listening ? "Listening" : "Not Listening";
		var firstOption = this.props.listening ?
			<MenuItem eventKey={"stop-" + listener.username}>Stop Listening</MenuItem> :
			<MenuItem eventKey={"start-" + listener.username}>Start Listening</MenuItem>;

		var actions = this.props.loggedUser ?
			<DropdownButton onSelect={this.onDropDownSelect} title={title}>
				{firstOption}
				<MenuItem eventKey={"show-" + listener.username}>
					<Link to="user" params={{username: listener.username}}>Show Profile</Link>
				</MenuItem>
			</DropdownButton> : "";

		return (
			<div className="listener-dt">
				<div className="listener-dt-img">
					<Image infix="user" size="small" src={listener.image}/>
				</div>
				<div className="listener-dt-info">
					<h4>{listener.name}
						(
						<Link to="user" params={{username: listener.username}}>{listener.username}</Link>
						)
					</h4>
					{actions}
				</div>
			</div>
		);
	},

	onDropDownSelect: function (key) {
		var splitted = key.split("-");
		if (splitted[0] === "stop") {
			this.props.flux.actions.stopListen(splitted[1]);
		} else if (splitted[0] === "start") {
			this.props.flux.actions.listen(splitted[1]);
		}
	}
});