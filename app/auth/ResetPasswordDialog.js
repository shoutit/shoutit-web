import React from 'react';
import { Link } from 'react-router';
import { Input } from 'react-bootstrap';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from '../ui/DocumentTitle';
import Dialog from '../shared/components/helper/Dialog.jsx';
import Button from '../ui/Button';

import { requestPasswordReset } from '../actions/session';

export const ResetPasswordDialog = React.createClass({

  displayName: 'ResetPasswordDialog',

  handleSubmit(e) {
    const { onSubmit, onEmailSent, isRequestingPasswordReset } = this.props;
    e.preventDefault();
    const email = e.target.email.value;
    if (!email || isRequestingPasswordReset) {
      return;
    }
    e.target.email.blur();
    onSubmit(email).then(() => onEmailSent());
  },

  render() {
    const { onRequestClose, open } = this.props;
    const { isRequestingPasswordReset, passwordResetError: error } = this.props;
    return (
      <DocumentTitle title="Reset your password">
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
                <ul style={ { color: 'red', padding: 0 }}>
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
                label={ isRequestingPasswordReset ? 'Sending…' : 'Reset password'}
                />

            </form>

            <div className="separator"></div>
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
              <Link to="/login"><strong>Back to Log in</strong></Link>
            </div>
          </div>
        </Dialog>

      </DocumentTitle>
    );
  },

});


const mapStateToProps = state => {
  return {
    isRequestingPasswordReset: state.session.isRequestingPasswordReset,
    passwordResetError: state.session.passwordResetError,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: email => dispatch(requestPasswordReset(email)),
    onEmailSent: () => dispatch(replace('/login?recover_sent=true')),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordDialog);
