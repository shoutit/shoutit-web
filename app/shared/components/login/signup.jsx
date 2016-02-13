import React from "react";
import {StoreWatchMixin} from "fluxxor";
import {History, Link} from "react-router";
import DocumentTitle from "react-document-title";
import {Input,Button} from "react-bootstrap";
import {Dialog} from "material-ui";
import SocialLogin from "./socialLogin.jsx";

export default React.createClass({
  displayName: "Signup",
  mixins:[History, new StoreWatchMixin("users")],

  getInitialState() {
    return{
      loading: false,
      tosChecked: false,
      signupComplete: false,
      alerts: {first_name:"", email:"", password:""}
    };
  },

  getStateFromFlux() {
    const store = this.props.flux.store("users").getState();
    return {
      signup: store.signupStatus
    };
  },

  render() {
    const { signupComplete, alerts } = this.state;
    let form;

    if (!signupComplete) {
      form =
      <div className="si-signup">
        <div className="icon res1x-sign_logo"></div>
        <h3>Sign up</h3>
        <SocialLogin flux={this.props.flux} loginFailed={this.state.loginFailed} />
        <div className="separator separator-or"></div>
        <form onSubmit={ this.onSignupSubmit }>

          { alerts["first_name"] && <p className="small">{alerts["first_name"]}</p> }

          <Input
            ref="firstName"
            type="text"
            placeholder="First Name"
            className= { alerts["first_name"] ? "input-name input-alert" : "input-name" }
          />

          <Input
            ref="lastName"
            type="text"
            placeholder="Last Name"
            className= { alerts["last_name"] ? "input-name input-last-name input-alert": "input-name input-last-name" }
          />

          {(() => { // alert code
            if(alerts["email"])
              return <p className="small">{alerts["email"]}</p>;
          }
          )()}

          <Input ref="email" type="text" placeholder="Email" className=
            {alerts["email"]? "input-email input-alert": "input-email"} />

          {(() => { // alert code
            if(alerts["password"])
              return <p className="small">{alerts["password"]}</p>;
          }
          )()}

          <Input ref="pass" type="password" placeholder="Password" className=
            {alerts["password"]? "input-pass input-alert": "input-pass"} />

          <Button bsSize="large" type="submit" block
          className={this.state.loading? "btn-signup btn-signup-disabled":"btn-signup"}>
          {this.state.loading? "Signing up...": "Sign up"}</Button>
          <Input onChange={this.handleTos} checked={this.state.tosChecked} type="checkbox" label="By signing up, you agree to the Terms of Service and Privacy Policy"
           disabled={this.state.loading} />
        </form>
        <div className="separator"></div>
          <center>
            <div style={{marginBottom: "15px"}}>
              Have an account&#63;&nbsp;
              <Link to="/login">Log in</Link>
            </div>
          </center>
      </div>;
    } else {
      form =
        <div className="si-signup">
          <div className="icon res1x-sign_logo"></div>
          <h3>Sign up</h3>
          <p style={{marginTop:"50px"}}>
            Dear {this.state.signup.name}, welcome to Shoutit. We are happy to have you here!
          </p>
          <p className="small">
            To use Shoutit with full potential please verify your e-mail by clicking
            on the link we have sent to your email <span>{this.state.signup.email}</span>
          </p>
          <center>
            <div style={{marginBottom: "15px"}}>
              Go to the <Link to="/">Home Page</Link>
            </div>
          </center>
        </div>;
    }


    return(
      <DocumentTitle title="Sign up - Shoutit">
        <Dialog
          open
          onRequestClose={this.handleRequestClose}
          contentStyle={{marginTop:"-50px"}}
          contentClassName="si-dialog">

          { form }

        </Dialog>
      </DocumentTitle>
    );
  },

  handleRequestClose() {
    this.history.goBack();
  },

  componentDidUpdate() {
    // handling server response
    if (this.state.loading) {
      if (this.state.signup.hasOwnProperty("status")) {
        let status = this.state.signup.status;

        this.setState({loading:false});

        if (status === "SIGNUP_FAIL")
          this.showFormAlerts();
        else if (status === "SIGNUP_SUCCESS") {
          this.setState({signupComplete: true});
        }
      }
    }
  },

  handleTos() {
    this.setState({tosChecked: !this.state.tosChecked});
  },

  onSignupSubmit(e) {
    e.preventDefault();
    let flux = this.props.flux;

    let acc = {};
    acc.name = this.refs.firstName.children[0].value;
    acc.name += " " + this.refs.lastName.children[0].value;
    acc.email = this.refs.email.children[0].value;
    acc.pass = this.refs.pass.children[0].value;

    if (acc.name && acc.email && acc.pass) {
      flux.actions.signup(acc);
      this.setState({loading: true});
    }
  },

  showFormAlerts() {
    // alerting user for specific form errors from API
    let signup = this.state.signup;
    let signupAlerts = {};

    // clear status for retry
    this.setState({signup:{}});

    if (signup.status === "SIGNUP_FAIL") {
      for(let key in signup)
        signupAlerts[key] = signup[key][0];

      delete signupAlerts.status;
      this.setState({alerts: signupAlerts});
    }
  }
});
