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
    const { open } = this.state;
    return (
      <div className="topbar-buttons-notif"
        onMouseEnter={ () => this.setState({ open: true }) }
        onMouseLeave={ () => this.setState({ open: false }) }>
        <Link to="/messages">
          <Icon name="chat"/>
        </Link>
        { open &&
          <div className="topbar-notification-holder">
              <div className="topbar-notification-box">
                <ConversationsList
                  onItemClick={ () => this.setState({ open: false })}
                  conversations={ conversations }
                  loading={ chat.loading }
                  loggedUser={ loggedUser }
                />
                <Link to="/messages" className="notifbox-see-all">
                    See All
                </Link>
              </div>
            </div>
          }
      </div>
    );
  }

}
