import React, { Component, PropTypes } from 'react';
import noop from 'lodash/noop';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';

import * as loginActions from '../auth/loginActions';

if (process.env.BROWSER) {
  require('./RequiresLogin.scss');
}

export class RequiresLogin extends Component {

  static propTypes = {
    event: PropTypes.string, // the event that should trigger the action for which the login is required
    redirectUrl: PropTypes.string, // redirect to this url after login instead of the currentUrl
    loginAction: PropTypes.oneOf(Object.keys(loginActions).map(action => action.toLowerCase())), // passed as login_action in the querystring
    actionParams: PropTypes.string, // passed as login_params in the querystring
    currentUrl: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.redirectToLogin = this.redirectToLogin.bind(this);
  }

  getRedirect() {
    const { currentUrl, loginAction, redirectUrl, actionParams } = this.props;
    let url = '/login';
    if (currentUrl) {
      url += `?redirect=${redirectUrl || currentUrl}`;
    }
    if (loginAction) {
      url += `&login_action=${loginAction}`;
      if (actionParams) {
        url += `&login_params=${actionParams}`;
      }
    }
    return url;
  }

  redirectToLogin() {
    this.props.dispatch(push(this.getRedirect()));
  }

  render() {
    const { children, isLoggedIn, event, ...props } = this.props;
    const redirect = this.getRedirect();
    if (event && !isLoggedIn) {
      return (
        <Link to={ redirect }>
          { React.cloneElement(children, { [event]: noop }) }
        </Link>
      );
    }
    if (!isLoggedIn) {
      return (
        <div className="RequiresLogin">
          <FormattedMessage
            id="requiresLogin.message"
            defaultMessage="Please {linkLabel} to access this page."
            values={ {
              linkLabel: (
                <Link to={ redirect }>
                  <FormattedMessage id="requiresLogin.linkLabel" defaultMessage="login" />
                </Link>),
            } }
          />
        </div>
      );
    }
    return React.cloneElement(children, props);
  }
}

const mapStateToProps = state => ({
  isLoggedIn: !!state.session.user,
  currentUrl: state.routing.currentUrl,
});

export default connect(mapStateToProps)(RequiresLogin);
