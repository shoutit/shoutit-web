import React from 'react';
import Clear from './../helper/clear.jsx';
import {Link} from 'react-router';
import {Input,Button} from 'react-bootstrap';

export default React.createClass({
	displayName: "NativeLogin",

	render() {
		return(
			<div>
				<form onSubmit={this.onLoginSubmit}>
					<Input ref='email' type='email' placeholder='Email' className='input-email' />
					<Input ref='pass' type='password' placeholder='Password' className='input-pass' />
					<Button bsSize='large' type='submit' block 
					className={this.props.logingIn? 'btn-signin btn-signin-disabled':'btn-signin'}>
					{this.props.logingIn? 'Signing In...': 'Sign In'}</Button>
					<Input type='checkbox' label='Stay Signed In' />
				</form>

				<Clear />
			</div>
		);
	},

	onLoginSubmit(e) {
		e.preventDefault();
		let flux = this.props.flux;

		let email = React.findDOMNode(this.refs.email).children[0].value;
		let pass = React.findDOMNode(this.refs.pass).children[0].value;

		if(email && pass)
			flux.actions.login('shoutit',{email:email,pass:pass});
	}
});