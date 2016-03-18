import React from "react";
import DocumentTitle from "react-document-title";
import { Link } from "react-router";
import { Input } from "react-bootstrap";
import { StoreWatchMixin } from "fluxxor";

import Dialog from "../shared/components/helper/Dialog.jsx";
import Button from "../shared/components/helper/Button.jsx";

export default React.createClass({

  displayName: "ResetPasswordDialog",

  mixins: [new StoreWatchMixin("auth")],

  componentWillReceiveProps(nextProps) {
    if (this.props.open && !nextProps.open) {
      // Dialog has been closed
      this.props.flux.actions.resetAuthErrors();
    }
  },

  getStateFromFlux() {
    const flux = this.props.flux;
    return flux.store("auth").getState();
  },

  handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email || this.state.isRequestingPasswordReset) {
      return;
    }
    e.target.email.blur();
    this.props.flux.actions.requestPasswordReset(email, err => {
      if (!err) {
        this.props.history.replace("/login");
      }
    });
  },

  render() {
    const { onRequestClose, open } = this.props;
    const { isRequestingPasswordReset, passwordResetError: error } = this.state;
    return (
      <DocumentTitle title="Reset your password - Shoutit">
        <Dialog
          titleWithIcon="Reset your password"
          open={ open }
          onRequestClose={ onRequestClose }
          contentStyle={{ marginTop: -50 }}
          contentClassName="si-dialog">

          <div className="si-login">
          <div className="separator"></div>
            <p>
              <small>You will receive a link to reset your password.</small>
            </p>
            <form onSubmit={this.handleSubmit}>

              { error &&
                <ul style={ { color: "red", padding: 0 }}>
                  { Object.keys(error).map(field =>
                      error[field].map((error, i) =>
                        <li key={`${field}-${i}`}>{ error }</li>
                      )
                    )
                  }
                </ul>
              }

              <Input
                disabled={ isRequestingPasswordReset }
                name="email"
                type="text"
                placeholder="Email or Username"
                className="input-email" />

              <Button
                type="submit" primary block disabled={ isRequestingPasswordReset }
                label={ isRequestingPasswordReset ? "Sending…": "Reset password"}
                />

            </form>

            <div className="separator"></div>
            <div style={{marginBottom: "15px", textAlign: "center"}}>
              <Link to="/login"><strong>Back to Log in</strong></Link>
            </div>
          </div>
        </Dialog>

      </DocumentTitle>
    );
  }

});
