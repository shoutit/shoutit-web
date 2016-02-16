import React from "react";
import {StoreWatchMixin} from "fluxxor";
import {Link, History} from "react-router";
import {Icon, Grid, Column} from "../helper";
import UserAvatar from "../user/UserAvatar.jsx";
import SVGIcon from "../helper/SVGIcon";

export default React.createClass({
  displayName: "ProfileCard",
  mixins: [StoreWatchMixin("users"), History],

  contextTypes: {
    flux: React.PropTypes.object,
    params: React.PropTypes.object
  },

  getStateFromFlux() {
    let flux = this.context.flux;

    return {
      users: flux.store("users").getState().users,
      user: flux.store("users").getState().user
    };
  },

  render() {
    let isLoggedIn = this.state.user;

    if ( isLoggedIn ) {
      let img = this.state.users[this.state.user].image,
        name = this.state.users[this.state.user].name,
        userImage = <UserAvatar user={ this.state.users[this.state.user] } size="small" linkToUserPage />;
      return (
                <section className="si-card gray-card">
                    <Grid fluid={true}>
                        <Column fluid={true} clear={true} size="3" className="card-list-img">
                            {userImage}
                        </Column>
                        <Column fluid={true} size="12" className="card-list-item">
                            <Link to={`/user/${this.state.user}`}>{name}</Link>
                        </Column>
                        <Column fluid={true} clear={true} size="3" className="card-list-img">
                            <SVGIcon name="pencil" active />
                        </Column>
                        <Column fluid={true} size="12" className="card-list-item">
                            <span onClick={() => this.history.pushState(null, `/user/${this.state.user}`, {_edit: 1})}>
                                Edit Profile
                            </span>
                        </Column>
                        <Column fluid={true} clear={true} size="3" className="card-list-img">
                            <SVGIcon name="balloon-dots" active />
                        </Column>
                        <Column fluid={true} size="12" className="card-list-item">
                            <Link to="/messages">Messages</Link>
                        </Column>
                        <Column fluid={true} clear={true} size="3" className="card-list-img">
                            <SVGIcon name="world-west" active />
                        </Column>
                        <Column fluid={true} size="12" className="card-list-item">
                            <Link to="/home">Browse</Link>
                        </Column>
                    </Grid>
                </section>
            );
    } else {
      return null;
    }
  }
});
