import React from 'react';
import {Navigation,Link} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';

export default React.createClass({
	displayName: "VerifyEmail",
	mixins: [new FluxMixin(React), new StoreWatchMixin('users'),Navigation],

	getInitialState() {
		return {
			redirecting: false
		}
	},
	
	getStateFromFlux() {
		let flux = this.getFlux();
		let store = flux.store('users').getState();

		if(store.verifyResponse === 'SUCCESS') {
			this.setState({redirecting: true});
			store.verifyResponse = '';
			setTimeout(function(){
				this.transitionTo("app");
			}
			.bind(this),2500);
		}
		return {
			response: store.verifyResponse
		}

	},

	componentDidMount() {
		if(this.props.query.token) {
			let flux = this.getFlux();

			flux.actions.verifyEmail(this.props.query.token);
		}
	},

	componentWillUpdate() {
		
	},

	render() {
		return (
			<DocumentTitle title="Verifying Email - Shoutit">
				<div className="login">
					<div className="login-container">
						<div className="top-login">
							<img src="../img/logo2.png"/>
							<h4>Activating your email</h4>
						</div>
						{this.state.response || '[Please wait...]'}
						{this.renderMsg()}
					</div>
				</div>
			</DocumentTitle>	
		);
	},

	renderMsg() {
		let msg;
		if(this.state.response)
			msg = <p>Please click <Link to="login">here</Link> to log in</p>;
		if(this.state.redirecting)
			msg = <p>Your email has been verified! Moving to <Link to="app">main page</Link>...</p>;
		return msg;
	}
});