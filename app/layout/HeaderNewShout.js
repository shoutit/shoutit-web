/*
* This component is created only for popup shout
* For embedded shout use embeddedShout.jsx
* github/p0o
*/
import React from "react";
import { StoreWatchMixin } from "fluxxor";

import ShoutForm from "../shared/components/shouting/form/shoutForm.jsx";

export default React.createClass({

  displayName: "HeaderNewShout",

  mixins: [new StoreWatchMixin("shouts")],

  getStateFromFlux() {
    const { currencies, categories, draft, status, waiting }
      = this.props.flux.store("shouts").getState();
    return {  currencies, categories, draft, status, waiting };
  },

  render() {
    const { loggedUser, currentLocation, onShoutSent, flux } = this.props;
    const { currencies, categories, draft, status, waiting } = this.state;
    return (
      <ShoutForm
        currencies={ currencies }
        categories={ categories }
        draft={ draft }
        status={ status }
        waiting={ waiting }
        loggedUser={ loggedUser }
        currentLocation={ currentLocation }
        collapsed={ false }
        onShoutSent={ onShoutSent }
        flux={ flux }
      />
    );
  }
});
