import React from "react";
import { StoreWatchMixin } from "fluxxor";
import { History, Link } from "react-router";
import DocumentTitle from "react-document-title";
import { Input, Button } from "react-bootstrap";
import { Dialog } from "material-ui";
import SocialLogin from "./socialLogin.jsx";

export default React.createClass({
  displayName: "Signup",
  mixins:[ History, new StoreWatchMixin("users") ],

  getInitialState() {
    return{
      loading: false,
      signupComplete: false,
      alerts: { first_name:"", email:"", password:"" }
    };
  },

  componentDidUpdate() {
    const { loading, signupStatus } = this.state;
    const { status } = signupStatus;
    // handling server response

    if (loading && status) {
      if (status === "SIGNUP_FAIL") {
        this.setState({ loading:false }, () => this.showFormAlerts());
      }
      if (status === "SIGNUP_SUCCESS") {
        this.setState({ loading: false, signupComplete: true});
      }
    }
  },

  getStateFromFlux() {
    const { signupStatus } = this.props.flux.store("users").getState();
    return { signupStatus };
  },


  handleFormSubmit(e) {
    e.preventDefault();
    if (this.state.loading) {
      return;
    }
    const account = {};
    account.name = this.refs.firstName.getValue();
    account.name += " " + this.refs.lastName.getValue();
    account.email = this.refs.email.getValue();
    account.pass = this.refs.pass.getValue();

    if (!account.name || !account.email || !account.pass) {
      return;
    }

    this.refs.firstName.getInputDOMNode().blur();
    this.refs.lastName.getInputDOMNode().blur();
    this.refs.email.getInputDOMNode().blur();
    this.refs.pass.getInputDOMNode().blur();

    this.setState({loading: true}, () =>
      this.props.flux.actions.signup(account)
    );

  },

  showFormAlerts() {
    // alerting user for specific form errors from API
    const { signupStatus } = this.state;
    if (signupStatus.status === "SIGNUP_FAIL") {
      const alerts = {};

      for (const key in signupStatus) {
        if (key !== "status") {
          alerts[key] = signupStatus[key][0];
        }
      }
      this.setState({ alerts });
      return;
    }
    this.setState({ signupStatus: {} });
  },

  renderForm() {
    const { alerts, loading } = this.state;

    return (
      <div className="si-signup">
        <div className="icon res1x-sign_logo"></div>
        <h3>Sign up</h3>
        <div className="separator separator-with"></div>
        <SocialLogin flux={this.props.flux} loginFailed={this.state.loginFailed} />
        <div className="separator separator-or"></div>
        <form onSubmit={ this.handleFormSubmit } noValidate>

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

          { alerts["email"] &&  <p className="small">{alerts["email"]}</p> }

          <Input
            ref="email"
            type="email"
            placeholder="Email" className=
            {alerts["email"]? "input-email input-alert": "input-email"} />

          { alerts["password"] && <p className="small">{ alerts["password"] }</p> }

          <Input
            ref="pass"
            type="password"
            placeholder="Password"
            className=
            { alerts["password"] ? "input-pass input-alert" : "input-pass"}
          />

          <Button
            bsSize="large"
            type="submit"
            block
            className={loading? "btn-signup btn-signup-disabled":"btn-signup"}>
            { loading ? "Signing up...": "Sign up" }
          </Button>

          <p className="signup-note">
            By signing up, you agree to the Terms of Service and Privacy Policy
          </p>
        </form>
        <div className="separator"></div>
        <div style={{marginBottom: "15px", textAlign: "center"}}>
          Have an account? <Link to="/login"><strong>Log in</strong></Link>
        </div>
      </div>
    );
  },

  renderSuccessMessage() {
    const { signupStatus } = this.state;
    return (
      <div className="si-signup">
        <div className="icon res1x-sign_logo"></div>
        <h3>Success!</h3>
        <div className="separator"></div>
        <p style={{ marginTop:"25px" }}>
          Dear { signupStatus.name }, welcome to Shoutit. We are happy to have you here!
        </p>
        <p className="small">
          To use Shoutit with full potential please verify your e-mail by clicking
          on the link we have sent to your email <span>{ signupStatus.email }</span>.
        </p>
        <center>
          <div style={{margin: "30px"}}>
            Go to your <a href="/"><strong>Home Page</strong></a>
          </div>
        </center>
      </div>
    );
  },

  render() {
    return(
      <DocumentTitle title="Sign up - Shoutit">
        <Dialog
          open
          onRequestClose={ () => this.history.goBack() }
          contentStyle={{marginTop:"-50px"}}
          contentClassName="si-dialog">

          { !this.state.signupComplete ?
              this.renderForm() :
              this.renderSuccessMessage()
          }

        </Dialog>
      </DocumentTitle>
    );
  }

});
