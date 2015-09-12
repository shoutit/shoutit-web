import React from 'react';
import {FluxMixin,StoreWatchMixin} from 'fluxxor';
import {Navigation,Link} from 'react-router';
import DocumentTitle from 'react-document-title';
import Clear from './../helper/clear.jsx';
import {Input,Button,Alert,Overlay,Tooltip} from 'react-bootstrap';

export default React.createClass({
	displayName: "Signup",
	mixins:[Navigation,new FluxMixin(React), new StoreWatchMixin('users')],

	getInitialState() {
		return{
			loading: false,
			tosChecked: false,
			signupFinished: false,
			alerts: {first_name:'',email:'',password:''}
		};
	},

	getStateFromFlux() {
		let flux = this.getFlux();
		let store = flux.store('users').getState();

		return {
			signup: store.signupStatus,
		};
	},

	render() {
		let form;
		if (!this.state.signupFinished) {
			form =
			<div>
				<div className="top-login">
					<Link to="app"><img src="img/logo2.png"/></Link>
					<h4>Signup and become a Shoutit member!</h4>
				</div>
				<form onSubmit={this.onSignupSubmit}>
					{(() => { // alert code
						if(this.state.alerts["first_name"])
							return <Alert bsStyle="warning">{this.state.alerts["first_name"]}</Alert>;
						}
					)()}

					<Input ref='name' type='text' placeholder='Name' className=
						{this.state.alerts["first_name"]? "input-name input-alert": "input-name"} />

					{(() => { // alert code
						if(this.state.alerts["email"])
							return <Alert bsStyle="warning">{this.state.alerts["email"]}</Alert>;
						}
					)()}

					<Input ref='email' type='text' placeholder='Email' className=
						{this.state.alerts["email"]? "input-email input-alert": "input-email"} />

					{(() => { // alert code
						if(this.state.alerts["password"])
							return <Alert bsStyle="warning">{this.state.alerts["password"]}</Alert>;
						}
					)()}

					<Input ref='pass' type='password' placeholder='Password' className=
						{this.state.alerts["password"]? "input-pass input-alert": "input-pass"} />

					<Button bsSize='large' type='submit' block disabled={!this.state.tosChecked}
					className={this.state.loading? 'btn-signin btn-signin-disabled':'btn-signin'}>
					{this.state.loading? 'Signing Up...': 'Sign Up'}</Button>
					<Input onChange={this.handleTos} checked={this.state.tosChecked} type='checkbox' label='I accept Shoutit terms of use'
					 disabled={this.state.loading} />
				</form>
				<span className="link-item" style={{float:'left',color:'#8a8a88'}} onClick={() => this.transitionTo('login')}>
					Back to Log In page
				</span>
			</div>;
		} else {
			form =
				<div>
					<div className="top-login">
						<img src="img/logo2.png"/>
					</div>
					<p style={{fontSize:'14px',marginTop:'50px'}}>
						Dear {this.state.signup.name}, welcome to Shoutit. We are happy to have you here!
					</p>
					<p>
						To use Shoutit with full potential please verify your email by clicking 
						on the link we have sent to your email <span>{this.state.signup.email}</span>
					</p>
					<span className="link-item" onClick={() => this.transitionTo('app')}>
						Main page
					</span>
				</div>;
		}


		return(
			<DocumentTitle title="Signup - ShoutIt">
				<div className="login">
					<div className="login-container">
						{form}
						<Clear />
					</div>
				</div>
			</DocumentTitle>
		);
	},

	componentDidUpdate() {
		// handling server response
		if (this.state.loading) {
			if (this.state.signup.hasOwnProperty("status")) {
				let status = this.state.signup.status;

				this.setState({loading:false});

				if (status === 'SIGNUP_FAIL') 
					this.showFormAlerts();
				else if (status === 'SIGNUP_SUCCESS') {
					this.setState({signupFinished: true});
				}
			}
		}
	},

	handleTos() {
		this.setState({tosChecked: !this.state.tosChecked});
	},

	onSignupSubmit(e) {
		e.preventDefault();
		let flux = this.getFlux();

		let acc = {};
		acc.name = React.findDOMNode(this.refs.name).children[0].value;
		acc.email = React.findDOMNode(this.refs.email).children[0].value;
		acc.pass = React.findDOMNode(this.refs.pass).children[0].value;

		if (acc.name && acc.email && acc.pass){
			flux.actions.signup(acc);
			this.setState({loading:true});
		}
	},

	showFormAlerts() {
		// alerting user for specific form errors from API
		let signup = this.state.signup;
		let signupAlerts = {};

		// clear status for retry
		this.setState({signup:{}});

		if (signup.status === 'SIGNUP_FAIL') {
			for(let key in signup)
				signupAlerts[key] = signup[key][0];

			delete signupAlerts.status;
			this.setState({alerts:signupAlerts});
		}
	}
});