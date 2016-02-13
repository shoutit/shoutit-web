import React from "react";
import ReactDOM from "react-dom";
import { Input, Button } from "react-bootstrap";

export default React.createClass({

  displayName: "NativeLogin",

  onLoginSubmit(e) {
    e.preventDefault();

    const flux = this.props.flux;
    const email = ReactDOM.findDOMNode(this.refs.email).children[0].value;
    const pass = ReactDOM.findDOMNode(this.refs.pass).children[0].value;

    if (email && pass) {
      flux.actions.login("shoutit",{email:email, pass:pass});
    }
  },

  render() {
    return(
      <div>
        <form onSubmit={ this.onLoginSubmit } noValidate>
          <Input ref="email" type="email" placeholder="Email or Username" className="input-email" />
          <Input ref="pass" type="password" placeholder="Password" className="input-pass" />
          <Button bsSize="large" type="submit" block
              className={ this.props.logingIn ? "btn-signin btn-signin-disabled" : "btn-signin" }>
          {this.props.logingIn? "Logging in...": "Log in"}</Button>
          <Input type="checkbox" label="Keep me logged in" />
        </form>
      </div>
    );
  }

});
