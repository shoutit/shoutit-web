


var React = require('react'),
	DropdownButton = require('react-bootstrap').DropdownButton,
	Col = require('react-bootstrap').Col,
	MenuItem = require('react-bootstrap').MenuItem;

var Icon = require('../../helper/icon.jsx');


module.exports = React.createClass({


	render: function () {
		var title = (<div>
			<Icon name="bell-icon"/>
			<span className="small-circle">2</span>
		</div>);
		return (
			<DropdownButton className="nortification" noCaret={true} navItem={true} title={title}>
				<MenuItem className="nav-setting">
					<Col xs={9} md={9}>
						<span>Notifications (2)</span>
					</Col>
					<Col xs={3} md={3}>
						<a href="#">
							Settings
						</a>
					</Col>
				</MenuItem>
				<MenuItem>
					<a href="#">
						<span>An nam soluta antiopam</span>
						<p>Mel eu impedit placerat dissentiunt. Eam verterem adver    sarium ne, cum ad sint idque dolores.</p>
					</a>
				</MenuItem>
				<MenuItem className="last-child">
					<a href="#">
						<span>See all</span>
					</a>
				</MenuItem>
			</DropdownButton>
		)
	}
});