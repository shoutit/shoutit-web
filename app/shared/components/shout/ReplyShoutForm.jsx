import React from "react";
import { Input } from "react-bootstrap";

import SVGIcon from "../../components/helper/SVGIcon";
import UserAvatar from "../../../users/UserAvatar";

import { StoreWatchMixin } from "fluxxor";
import { History } from "react-router";

if (process.env.BROWSER) {
  require("styles/components/ReplyShoutForm.scss");
}

// TODO: pass logged user as prop (gpbl)
// TODO: logic to check if logged user is defined should go up in the tree (gpbl)

export default React.createClass({

  displayName: "ReplyShoutForm",

  mixins: [ StoreWatchMixin("users"), History],

  contextTypes: {
    flux: React.PropTypes.object,
    location: React.PropTypes.object
  },

  getInitialState() {
    return {
      loading: false
    };
  },

  getDefaultProps() {
    return {
      placeholder: "Reply to this shout…"
    };
  },

  getStateFromFlux() {
    const usersStore = this.context.flux.store("users");
    const loggedUser = usersStore.getLoggedUser();
    const { users } = usersStore.getState();
    return { loggedUser, users };
  },

  handleFormSubmit(e) {
    e.preventDefault();

    const { shout } = this.props;
    const { loading, loggedUser } = this.state;
    const { form } = this.refs;

    if (!loggedUser) {
      const { pathname } = this.context.location;
      console.log(pathname);
      console.log(e);
      this.history.pushState({ modal: "login" }, pathname);
      return;
    }

    const text = form.text.value.trim();
    if (!text) {
      form.text.focus();
      return;
    }

    form.text.blur();

    if (loading) {
      return;
    }

    this.setState({ loading: true });

    this.context.flux.actions.replyToShout(
      loggedUser,
      shout.id,
      text,
      (error, message) => {
        this.setState({ loading: false });
        if (error) {
          throw(error);
        }
        this.history.pushState(null, `/messages/${message.conversation_id}`);
      }
    );
  },

  handleFocus() {
    const { loggedUser } = this.state;

    if (!loggedUser) {
      const { pathname } = this.context.location;
      // TODO: (p0o) Should find a better solution for here
      // This hack is used because when the page scroll is on top the login dialog will fade away-
      // instantly after it is appeared.
      setTimeout(() => {
        this.history.pushState({ modal: "login" }, pathname);
      }, 0);
    }
  },

  render() {
    const { shout, placeholder } = this.props;
    const { loggedUser } = this.state;

    if (loggedUser && (shout.user.username === loggedUser.username)) {
      return null;
    }

    return (
      <div className="ReplyShoutForm">
        <span className="ReplyShoutForm-avatar">
          <UserAvatar user={ loggedUser }  />
        </span>
        <form ref="form" className="ReplyShoutForm-form" onSubmit={ e => this.handleFormSubmit(e) }>
          <Input
            name="text"
            autoComplete="off"
            onFocus={ this.handleFocus }
            type="text"
            placeholder={ placeholder }
          />
          <SVGIcon className="ReplyShoutForm-btn" name="send" hover onClick={ e => this.handleFormSubmit(e) } />
        </form>
      </div>
    );
  }

});
