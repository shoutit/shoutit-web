import React from "react";
import { StoreWatchMixin } from "fluxxor";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import { Input } from "react-bootstrap";
import { Dialog } from "material-ui";

import SocialLoginForm from "../login/SocialLoginForm.jsx";
import Button from "../helper/Button.jsx";

import { imagesPath } from "../../../../config";

export default React.createClass({

  displayName: "SignupDialog",

  mixins: [new StoreWatchMixin("users") ],

  getInitialState() {
    return {
      loading: false,
      showSuccessMessage: false,
      alerts: { first_name:"", email:"", password:"" }
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.open && this.props.loggedUser !== nextProps.loggedUser && nextProps.loggedUser) {
      this.setState({ showSuccessMessage: true });
    }
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
        this.setState({ loading: false, showSuccessMessage: true});
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

        <div style={{ textAlign: "center"}}>
          <img src={ `${imagesPath}/mark.svg` } height={44} />
        </div>
        <h3>Sign up</h3>

        <div className="separator separator-with"></div>

        <SocialLoginForm flux={ this.props.flux } />

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
            type="submit"
            primary
            block
            disabled={ loading }
            label={loading ? "Signing up…": "Sign up" } />

          <p className="signup-note">
            By signing up, you agree to the<br/>Terms of Service and the Privacy Policy
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
    const { loggedUser } = this.props;
    return (
      <div className="si-signup">
        <div style={{ textAlign: "center"}}>
          <img src={ `${imagesPath}/mark.svg` } height={44} />
        </div>
        <h3>Success!</h3>
        <div className="separator"></div>
        <p style={{ marginTop:"25px" }}>
          Dear { loggedUser.first_name }, welcome to Shoutit. We are happy to have you here!
        </p>
        <p className="small">
          To use Shoutit with full potential, please verify your e-mail address
          by clicking on the link we have sent to your email <span>{ signupStatus.email }</span>.
        </p>
        <center>
          <div style={{margin: "30px"}}>
            Go to your <Link to="/home"><strong>Home Page</strong></Link> now.
          </div>
        </center>
      </div>
    );
  },

  render() {
    const { open, onRequestClose, loggedUser } = this.props;
    return(
      <DocumentTitle title="Sign up - Shoutit">
        <Dialog
          open={ open }
          onRequestClose={ onRequestClose }
          contentStyle={{ marginTop: -50 }}
          contentClassName="si-dialog">

          { (!this.state.showSuccessMessage || !loggedUser) ?
              this.renderForm() :
              this.renderSuccessMessage()
          }

        </Dialog>
      </DocumentTitle>
    );
  }

});
