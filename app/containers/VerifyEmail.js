import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';
import Page from '../layout/Page';
import Frame from '../layout/Frame';

import { verifyEmail } from '../actions/session';

const fetchData = (dispatch, state, params) =>
  dispatch(verifyEmail(params.token))
    .then(() => {})
    .catch(() => {});

export class VerifyEmail extends Component {

  static fetchData = fetchData;

  static propTypes = {
    error: PropTypes.object,
  }

  render() {
    const { error } = this.props;
    return (
      <Page title={ error ? 'Error verifying your e-mail' : 'E-mail has been verified' }>

        { error &&
          <Frame title="Verify your e-mail">
            <div className="Frame-body">
              <p className="htmlErrorParagraph">
                { error.message }
              </p>
            </div>
          </Frame>
        }
        { !error &&
          <Frame title="All done">
            <div className="Frame-body">
              <p style={{ textAlign: 'center' }}>
                Thanks, your e-mail has been verified!
              </p>
              <div className="Frame-form" style={{ textAlign: 'center' }}>
                <Button primary to="/" label="Go to your home page" />
              </div>
            </div>
          </Frame>
        }

      </Page>
    );
  }

}

const mapStateToProps = state => {
  return {
    error: state.session.verifyEmailError,
  };
};

export default connect(mapStateToProps)(VerifyEmail);
