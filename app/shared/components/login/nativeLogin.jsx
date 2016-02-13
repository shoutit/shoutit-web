import React from "react";
import { Input, Button } from "react-bootstrap";

export default React.createClass({

  displayName: "NativeLogin",

  onLoginSubmit(e) {
    e.preventDefault();
    const flux = this.props.flux;
    const email = this.refs.email.getValue();
    const pass = this.refs.password.getValue();

    if (email && pass) {
      this.refs.email.getInputDOMNode().blur();
      this.refs.password.getInputDOMNode().blur();
      flux.actions.login("shoutit", { email, pass });
    }

  },

  render() {
    return(
      <div>
        <form onSubmit={ this.onLoginSubmit } noValidate>
          <Input ref="email" type="email" placeholder="Email or Username" className="input-email" />
          <Input ref="password" type="password" placeholder="Password" className="input-pass" />
          <Button bsSize="large" type="submit" block
              className={ this.props.logingIn ? "btn-signin btn-signin-disabled" : "btn-signin" }>
          {this.props.logingIn? "Logging in...": "Log in"}</Button>
          <Input type="checkbox" label="Keep me logged in" />
        </form>
      </div>
    );
  }

});
