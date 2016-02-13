import React from "react";
import { Input } from "react-bootstrap";
import UserImage from "../../../user/userImage.jsx";
import { Icon } from "../../../helper";
import { StoreWatchMixin } from "fluxxor";
import { History } from "react-router";

export default React.createClass({
  displayName: "ShoutFooter",
  mixins: [StoreWatchMixin("users"), History],

  getStateFromFlux() {
    const usersStore = this.props.flux.store("users");
    const loggedUser = usersStore.getLoggedUser();
    const { users } = usersStore.getState();
    return { loggedUser, users };
  },

  submit() {
    const { loggedUser } = this.state;
    const { shout } = this.props;
    const text = this.refs.form.text.value.trim();
    this.props.flux.actions.replyToShout(
      loggedUser,
      shout.id,
      text,
      (error, message) => {
        if (error) {
          throw(error);
        }
        this.history.pushState(null, `/messages/${message.conversation_id}`);
      }
    );
  },

  render() {
    const { shout } = this.props;
    const { loggedUser } = this.state;
    return (
      <div>
      { loggedUser && shout.user.username !== loggedUser.username &&
        <div className="shout-footer">
          <UserImage image={loggedUser.image} type="square" height={36} width={36}/>
          <form ref="form" onSubmit={ e => { e.preventDefault(); this.submit(); }}>
            <Input autoComplete="off" name="text" type="text" placeholder="Reply to shout…"/>
            <Icon name="send" onSwitchClick={ () => this.submit() } className="shout-send" />
          </form>
        </div>
      }
      </div>
    );
  }

});
