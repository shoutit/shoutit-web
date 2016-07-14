import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import Helmet from '../utils/Helmet';

import Button from '../forms/Button';
import Page from '../layout/Page';
import Frame from '../layout/Frame';
import { verifyEmail } from '../actions/session';

const fetchData = (dispatch, state, params) =>
  dispatch(verifyEmail(params.token))
    .then(() => {})
    .catch(() => {});

const MESSAGES = defineMessages({
  pageTitleSuccess: {
    id: 'verifyEmail.page.success.title',
    defaultMessage: 'Your e-mail has been verified',
  },
  pageTitleFailure: {
    id: 'verifyEmail.page.error.title',
    defaultMessage: 'Error verifying your e-mail',
  },
  titleError: {
    id: 'verifyEmail.error.title',
    defaultMessage: 'Verify your e-mail',
  },
  titleSuccess: {
    id: 'verifyEmail.success.title',
    defaultMessage: 'All done',
  },
  successMessage: {
    id: 'verifyEmail.success.message',
    defaultMessage: 'Thanks, your e-mail has been verified!',
  },
  successButton: {
    id: 'verifyEmail.success.button',
    defaultMessage: 'Go to your home page',
  },
});

export class VerifyEmail extends Component {

  static fetchData = fetchData;

  static propTypes = {
    error: PropTypes.object,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { error } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Page>
        <Helmet title={ error ? formatMessage(MESSAGES.pageTitleFailure) : formatMessage(MESSAGES.pageTitleSuccess) } />
        { error &&
          <Frame title={ formatMessage(MESSAGES.titleError) }>
            <div className="Frame-body">
              <p className="htmlErrorParagraph">
                { error.message }
              </p>
            </div>
          </Frame>
        }
        { !error &&
          <Frame title={ formatMessage(MESSAGES.titleSuccess) }>
            <div className="Frame-body">
              <p style={ { textAlign: 'center' } }>
                { formatMessage(MESSAGES.successMessage) }
              </p>
              <div className="Frame-form" style={ { textAlign: 'center' } }>
                <Button kind="primary" to="/">
                  { formatMessage(MESSAGES.successButton) }
                </Button>
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

const Wrapped = connect(mapStateToProps)(injectIntl(VerifyEmail));
Wrapped.fetchData = VerifyEmail.fetchData;
export default Wrapped;
