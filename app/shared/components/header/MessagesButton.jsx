import React, { Component } from "react";
import { Link } from "react-router";
import Popover from "material-ui/lib/popover/popover";

import ConversationsList from "../chat/ConversationsList.jsx";

import Icon from "../helper/icon.jsx";

export default class MessagesButton extends Component {

  state = {
    open: false
  };

  render() {
    const { conversations, chat, loggedUser } = this.props;
    const { open, anchor } = this.state;
    return (
      <div>
        <Link to="/messages" onClick={ (e) => {
          e.preventDefault();
          this.setState({ open: !open, anchor: e.currentTarget });
        }}>
          <Icon name="chat"/>
        </Link>
        <Popover
         open={ open }
         anchorEl={ anchor }
         anchorOrigin = { {vertical: "bottom", horizontal: "right" } }
         animated={ false }
         useLayerForClickAway={ false }
         onRequestClose={ () => this.setState({ open: false })}>
          <ConversationsList
            onItemClick={ () => this.setState({ open: false })}
            conversations={ conversations }
            loading={ chat.loading }
            loggedUser={ loggedUser }
          />
        </Popover>
      </div>
    );
  }

}
