import React, { Component } from "react";

export default class LoginRedirect extends Component {

  static propTypes = {
    children: React.PropTypes.element
  };

  componentWillMount() {
    this.handleLoginRedirect(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleLoginRedirect(nextProps);
  }

  handleLoginRedirect(props) {
    const { location } = props;
    const state = location.state || {};

    const onLoginRoute = location.query.login || location.pathname === "/login";
    if (onLoginRoute && state.modal !== "login") {
      props.history.setState({ modal: "login" });
    }

    const onSignupRoute = location.query.signup || location.pathname === "/signup";
    if (onSignupRoute && state.modal !== "signup") {
      props.history.setState({ modal: "signup" });
    }

  }

  render() {
    const { children, ...props } = this.props;
    return React.cloneElement(children, props);
  }

}
