import React from "react";
import {Column} from "../helper";
import ShoutForm from "./form/shoutForm.jsx";
import { ConnectToStores } from "../../../utils/FluxUtils";

function mapStoresProps(stores) {
  const shoutsStoreState = stores.shouts.getState();
  const { draft, status, waiting } = shoutsStoreState;
  return {
    currencies: stores.currencies.get(),
    categories: stores.categories.get(),
    loggedUser: stores.auth.getLoggedProfile(),
    currentLocation: stores.location.getCurrentLocation(),
    draft, status, waiting
  };
}

export class EmbeddedShout extends React.Component {

  static propTypes = {
    collapsed: React.PropTypes.bool
  };

  state = {
    collapsed: this.props.collapsed
  };

  onFocus(e) {
    this.setState({ collapsed: e.focused });
  }

  render() {
    return (
      <Column size="9" clear={true}>
        <ShoutForm
          { ...this.props }
          collapsed={ this.state.collapsed }
          onUserFocus={ this.onFocus.bind(this) }
        />
      </Column>
    );
  }
}

export default ConnectToStores(EmbeddedShout, { mapStoresProps });
