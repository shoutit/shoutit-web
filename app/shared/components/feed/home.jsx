import React from "react";
import { Grid, Column } from "../helper";

import { SideFooterCard, ListeningCard, ListenToCard, ProfileCard, InterestsCard, SuggestShoutCard } from "../cards";

export default React.createClass({
  //
  // childContextTypes: {
  //   flux: React.PropTypes.object,
  //   params: React.PropTypes.object,
  //   location: React.PropTypes.object
  // },
  //
  // getChildContext() {
  //   return {
  //     flux: this.props.flux,
  //     params: this.props.params,
  //     location: this.props.location
  //   };
  // },
  //
  // getStateFromFlux() {
  //   const {flux} = this.props;
  //   const tags = flux.store("tags").getState();
  //   const users = flux.store("users").getState().users;
  //   const listens = flux.store("users").getState().listens;
  //   const loading = flux.store("users").getState().loading;
  //
  //   return {
  //     tags,
  //     users,
  //     listens,
  //     loading
  //   };
  // },

  loadListeningData() {
    const { listens, loading } = this.state;
    const { loggedUser, flux } = this.props;
    if (loggedUser && !loading && !listens[loggedUser.username]) {
      flux.actions.loadUserListening(loggedUser.username);
    }
  },

  render() {
    return <div>Home</div>
    const {
      currentLocation,
      flux,
      loggedUser,
      suggestedShout,
      suggestedTags,
      suggestedUsers,
      listening,
      children
    } = this.props;

    return (
      <Grid>
          <Column size="3" clear={true}>
            { loggedUser && <ProfileCard user={ loggedUser } /> }
            { listening && listening.users &&
              <ListeningCard
                users={ listening.users }
                flux={ flux }
              />
            }
          </Column>
          <Column size="9">
              { React.cloneElement(children, { ...this.props }) }
          </Column>
          <Column size="3">
            <InterestsCard
              flux={ flux }
              tags={ suggestedTags }
              countryCode={ currentLocation.country }
            />
            <ListenToCard
              flux={ flux }
              users={ suggestedUsers }
              currentLocation={ currentLocation }
            />
            <SuggestShoutCard
              shout={ suggestedShout }
            />
            <SideFooterCard />
          </Column>
      </Grid>
    );
  }
});
