/** @jsx React.DOM */

var React = require('react'),
	Clear = require('./helper/clear.jsx');

module.exports = Login = React.createClass({
	render: function () {
		return (
			<div className="login">
				<div className="login-container">
					<div className="top-login">
						<img src="img/logo2.png"/>
						<h4>What will you shout today</h4>
					</div>
					<Clear />
					<input type="text" placeholder="Email" className="email"/>
					<input type="text" placeholder="Password" className="pass"/>
					<button className="btn btn-sign btn-submit submit" type="button">
						Sign In
					</button>
					<Clear />
					<div className="login-inl">
						<div className="stay">
							<input type="radio" id="stay"/>
							<label htmlFor="stay">Stay Signed in</label>
						</div>
						<div className="login-help">
							<p>Help</p>
						</div>
					</div>
					<button className="btn btn-fb submit" type="button">Connect with Facebook</button>
					<button className="btn btn-google submit" type="button">Connect with Google+</button>
					<p className="login-bot">Don't have an account?
						<span>Sign Up</span>
					</p>
				</div>
			</div>
		);
	}
});