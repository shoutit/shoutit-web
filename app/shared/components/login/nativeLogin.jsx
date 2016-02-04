import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import {Input,Button} from 'react-bootstrap';

export default React.createClass({
  displayName: "NativeLogin",

  render() {
    return(
      <div>
        <form onSubmit={this.onLoginSubmit}>
          <Input ref='email' type='email' placeholder='Email or username' className='input-email' />
          <Input ref='pass' type='password' placeholder='Password' className='input-pass' />
          <Button bsSize='large' type='submit' block 
              className={this.props.logingIn? 'btn-signin btn-signin-disabled':'btn-signin'}>
          {this.props.logingIn? 'Logging In...': 'Log In'}</Button>
          <Input type='checkbox' label='Keep me logged in' />
        </form>
      </div>
    );
  },

  onLoginSubmit(e) {
    e.preventDefault();
    let flux = this.props.flux;

    let email = ReactDOM.findDOMNode(this.refs.email).children[0].value;
    let pass = ReactDOM.findDOMNode(this.refs.pass).children[0].value;

    if(email && pass)
      flux.actions.login('shoutit',{email:email, pass:pass});
  }
});