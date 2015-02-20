/** @jsx React.DOM */

var React = require('react'),
	Col = require('react-bootstrap/Col'),
	Input = require('react-bootstrap/Input'),
	Nav = require('react-bootstrap/Nav'),
	Icon = require('../helper/icon.jsx'),
	DropdownMenu = require('react-bootstrap/DropdownMenu');


module.exports = HeaderIcon = React.createClass({
	render: function() {
		return (
			<Col className="header-icon" xs={12} md={4}>
				<Nav right={true}>
					<li>
						<a href="#" data-toggle="modal" data-target=".step1">
							<Icon name="plug-icon"/>
						</a>
					</li>
					<li className="dropdown messages">
						<a href="#" classNam="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
							<Icon name="message-icon"/>
						</a>
						<span className="small-circle">3</span>
						<DropdownMenu>
							<li className="nav-setting">
								<Col xs={5} md={6}>
									<span>
										inbox (3)
									</span>
								</Col>
								<Col xs={7} md={6}>
									<a href="#">
										Send a new message
									</a>
								</Col>
							</li>
							<li>
								<Col xs={2} md={2}>
									<img src="img/dummies/person1-icon.png"/>
								</Col>
								<Col xs={10} md={10}>
									<a href="#">
										<span className="person-name">
											Adriana Lima
										</span>
										<span className="small-circle2 active">
											<p>
												Lorem ipsum dolor sit amet, his interesset is cludaturque te, id pro timeam...
											</p>
										</span>
									</a>
								</Col>
							</li>
							<div className="see-all">
								<span>See all messages</span>
							</div>
						</DropdownMenu>
					</li>
					<li className="dropdown nortification">
						<a href="#" classNam="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
							<Icon name="bell-icon"/>
						</a>
						<span className="small-circle">2</span>
						<DropdownMenu>
							<li className="nav-setting">
								<Col xs={9} md={9}>
									<span>Notifications (2)</span>
								</Col>
								<Col xs={3} md={3}>
									<a href="#">
										Settings
									</a>
								</Col>
							</li>
							<li>
								<a href="#">
									<span>An nam soluta antiopam</span>
									<p>Mel eu impedit placerat dissentiunt. Eam verterem adver    sarium ne, cum ad sint idque dolores.</p>
								</a>
							</li>
							<li className="last-child">
								<a href="#">
									<span>See all</span>
								</a>
							</li>
						</DropdownMenu>
					</li>
					<li className="dropdown profile">
						<a href="#" classNam="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
							<div style={{
								"backgroundImage": "url('/img/dummies/person-icon.png')",
								"backgroundRepeat": "no-repeat",
								"height": "51px",
								"width": "58px"
							}}/>
						</a>
						<span className="small-circle">2</span>
						<DropdownMenu>
							<li>
								<a href="#">Edit Profile</a>
							</li>
							<li>
								<a href="#">Listening</a>
							</li>
							<li>
								<a href="#">Listeners</a>
							</li>
							<li>
								<a href="#">User's Offers</a>
							</li>
							<li>
								<a href="#">User's Requestes</a>
							</li>
							<li>
								<a href="#">Log Out</a>
							</li>
						</DropdownMenu>
					</li>


				</Nav>
			</Col>
		);
	}
});