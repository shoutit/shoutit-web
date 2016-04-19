import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import * as loginActions from '../auth/loginActions';

const noop = () => {};

export class RequiresLogin extends Component {

  static propTypes = {
    event: PropTypes.string, // the event that should trigger the action for which the login is required
    redirectUrl: PropTypes.string, // redirect to this url after login instead of the currentUrl
    loginAction: PropTypes.oneOf(Object.keys(loginActions).map(action => action.toLowerCase())),
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
    const { currentUrl, loginAction, redirectUrl } = this.props;
    let url = '/login';
    if (currentUrl) {
      url += `?redirect=${redirectUrl || currentUrl}`;
    }
    if (loginAction) {
      url += `&login_action=${loginAction}`;
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
        <div>
          Please <Link to={ redirect }>login</Link> to access this page.
        </div>
      );
    }
    return React.cloneElement(children, props);
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.session.user,
    currentUrl: state.routing.currentUrl,
  };
};

export default connect(mapStateToProps)(RequiresLogin);
