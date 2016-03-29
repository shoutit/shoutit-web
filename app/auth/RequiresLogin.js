import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
export class RequiresLogin extends React.Component {

  static propTypes = {
    children: React.PropTypes.element,
    loggedUser: React.PropTypes.object
  };

  render() {
    const { children, ...props } = this.props;
    if (!props.loggedUser) {
      let loginUrl = '/login';
      if (props.currentUrl) {
        loginUrl = `${loginUrl}?after=${props.currentUrl}`;
      }
      return (
        <div>
          Please <Link to={`${loginUrl}`}>login</Link> to access this page.
        </div>
      );
    }
    return React.cloneElement(children, props);
  }
}

const mapStateToProps = state => {
  return {
    loggedUser: state.session.user,
    currentUrl: state.routing.currentUrl
  };
};

export default connect(mapStateToProps)(RequiresLogin);
