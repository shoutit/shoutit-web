import React, { PropTypes } from "react";
import { FluxMixin, StoreWatchMixin } from "fluxxor";

import Header from "./header";
import MainPage from "./main/mainPage.jsx";

const pagesWithoutHeader = [ MainPage ];

export default React.createClass({

  displayName: "App",

  propTypes: {
    flux: PropTypes.object.isRequired
  },

  mixins: [new FluxMixin(React), new StoreWatchMixin("users")],

  getStateFromFlux() {
    const loggedUser = this.getFlux().store("users").getLoggedUser();
    return { loggedUser };
  },

  render() {
    const { loggedUser } = this.state;
    const { children, flux, routes } = this.props;

    const hideHeader = routes.some(route =>
      pagesWithoutHeader.indexOf(route.component) > -1
    );

    return (
      <div>
        { !hideHeader && <Header loggedUser={ loggedUser } flux={ flux }  /> }
        { React.cloneElement(children, { loggedUser }) }
      </div>
    );
  }
});
